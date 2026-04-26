<?php

namespace App\Http\Controllers;

use App\Models\FiscalYear;
use App\Models\BudgetCategory;
use App\Models\Signatory;
use App\Exports\DayaSerapExport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $fiscalYearId = $request->input('fiscal_year_id', FiscalYear::active()?->id);
        $month = (int) $request->input('month', now()->month);

        $fiscalYear = $fiscalYearId ? FiscalYear::find($fiscalYearId) : null;
        $fiscalYears = FiscalYear::orderBy('year', 'desc')->get();

        $reportData = null;

        if ($fiscalYear) {
            $reportData = $this->buildReportData($fiscalYear, $month);
        }

        return Inertia::render('Report/Index', [
            'reportData' => $reportData,
            'fiscalYear' => $fiscalYear,
            'fiscalYears' => $fiscalYears,
            'month' => $month,
            'signatories' => Signatory::orderBy('sort_order')->get(),
        ]);
    }

    public function export(Request $request)
    {
        $fiscalYearId = $request->input('fiscal_year_id', FiscalYear::active()?->id);
        $month = (int) $request->input('month', now()->month);
        $isAllMonths = $request->boolean('all_months', false);

        $fiscalYear = FiscalYear::findOrFail($fiscalYearId);
        $signatories = Signatory::orderBy('sort_order')->get();

        $monthNames = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret',
            4 => 'April', 5 => 'Mei', 6 => 'Juni',
            7 => 'Juli', 8 => 'Agustus', 9 => 'September',
            10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        $safeYear = str_replace('/', '-', $fiscalYear->year);

        if ($isAllMonths) {
            $allMonthsData = [];
            $monthsSequence = $fiscalYear->getFiscalMonths();
            foreach ($monthsSequence as $m) {
                $allMonthsData[$m] = $this->buildReportData($fiscalYear, $m);
            }
            
            $filename = "Daya_Serap_Semua_Bulan_{$safeYear}.xlsx";
            
            return Excel::download(
                new \App\Exports\AllMonthsDayaSerapExport($allMonthsData, $fiscalYear, $signatories),
                $filename
            );
        }

        $reportData = $this->buildReportData($fiscalYear, $month);
        $filename = "Daya_Serap_{$monthNames[$month]}_{$safeYear}.xlsx";

        return Excel::download(
            new DayaSerapExport($reportData, $fiscalYear, $month, $signatories),
            $filename
        );
    }

    /**
     * Get the logical index of a month in a fiscal year.
     * e.g., if start_month is 9 (September):
     * September (9) -> 1
     * October (10) -> 2
     * January (1) -> 5
     */
    protected function getFiscalMonthIndex(int $calendarMonth, int $startMonth): int
    {
        if ($calendarMonth >= $startMonth) {
            return $calendarMonth - $startMonth + 1;
        }
        return $calendarMonth + 12 - $startMonth + 1;
    }

    /**
     * Build report data for a given fiscal year and month.
     */
    public function buildReportData(FiscalYear $fiscalYear, int $month): array
    {
        $categories = $fiscalYear->categories()
            ->with(['items' => function ($q) use ($fiscalYear) {
                $q->with(['monthlyData' => function ($q2) use ($fiscalYear) {
                    $q2->where('fiscal_year_id', $fiscalYear->id);
                }]);
            }])
            ->orderBy('sort_order')
            ->get();

        $grandTotals = [
            'allocation' => 0,
            'receipt_this_month' => 0,
            'receipt_cumulative' => 0,
            'exp_personnel' => 0,
            'exp_goods' => 0,
            'exp_maintenance' => 0,
            'exp_travel' => 0,
            'exp_general' => 0,
            'exp_this_month' => 0,
            'exp_prev_months' => 0,
            'exp_cumulative' => 0,
            'remaining' => 0,
        ];

        $sections = [];

        foreach ($categories as $category) {
            $sectionTotals = [
                'allocation' => 0,
                'receipt_this_month' => 0,
                'receipt_cumulative' => 0,
                'exp_personnel' => 0,
                'exp_goods' => 0,
                'exp_maintenance' => 0,
                'exp_travel' => 0,
                'exp_general' => 0,
                'exp_this_month' => 0,
                'exp_prev_months' => 0,
                'exp_cumulative' => 0,
                'remaining' => 0,
            ];

            $startMonth = $fiscalYear->start_month ?: 1;
            $targetIndex = $this->getFiscalMonthIndex($month, $startMonth);

            $rows = [];

            foreach ($category->items as $item) {
                $currentMonthData = $item->monthlyData->where('month', $month)->first();
                $prevMonthsData = $item->monthlyData->filter(function ($md) use ($targetIndex, $startMonth) {
                    return $this->getFiscalMonthIndex($md->month, $startMonth) < $targetIndex;
                });
                $allUpToData = $item->monthlyData->filter(function ($md) use ($targetIndex, $startMonth) {
                    return $this->getFiscalMonthIndex($md->month, $startMonth) <= $targetIndex;
                });

                // Receipt
                $receiptThisMonth = (float) ($currentMonthData->receipt_amount ?? 0);
                $receiptCumulative = $allUpToData->sum('receipt_amount');

                // Expenditure this month by type
                $expPers = (float) ($currentMonthData->exp_personnel ?? 0);
                $expGoods = (float) ($currentMonthData->exp_goods ?? 0);
                $expMaint = (float) ($currentMonthData->exp_maintenance ?? 0);
                $expTravel = (float) ($currentMonthData->exp_travel ?? 0);
                $expGeneral = (float) ($currentMonthData->exp_general ?? 0);

                $expThisMonth = $expPers + $expGoods + $expMaint + $expTravel + $expGeneral;

                // Previous months cumulative expenditure
                $expPrevMonths = $prevMonthsData->sum(function ($md) {
                    return (float) $md->exp_personnel + (float) $md->exp_goods
                        + (float) $md->exp_maintenance + (float) $md->exp_travel
                        + (float) $md->exp_general;
                });

                $expCumulative = $expThisMonth + $expPrevMonths;

                $allocation = (float) $item->allocation;
                $remaining = $allocation - $expCumulative;

                // Absorption rates
                $absorptionReceipt = $allocation > 0 ? $receiptCumulative / $allocation : 0;
                $absorptionExpenditure = $allocation > 0 ? $expCumulative / $allocation : 0;

                $row = [
                    'id' => $item->id,
                    'account_code' => $item->account_code,
                    'description' => $item->description,
                    'allocation' => $allocation,
                    'receipt_this_month' => $receiptThisMonth,
                    'receipt_cumulative' => $receiptCumulative,
                    'exp_personnel' => $expPers,
                    'exp_goods' => $expGoods,
                    'exp_maintenance' => $expMaint,
                    'exp_travel' => $expTravel,
                    'exp_general' => $expGeneral,
                    'exp_this_month' => $expThisMonth,
                    'exp_prev_months' => $expPrevMonths,
                    'exp_cumulative' => $expCumulative,
                    'absorption_receipt' => $absorptionReceipt,
                    'absorption_expenditure' => $absorptionExpenditure,
                    'remaining' => $remaining,
                    'month_number' => $month,
                ];

                $rows[] = $row;

                // Accumulate section totals
                $sectionTotals['allocation'] += $allocation;
                $sectionTotals['receipt_this_month'] += $receiptThisMonth;
                $sectionTotals['receipt_cumulative'] += $receiptCumulative;
                $sectionTotals['exp_personnel'] += $expPers;
                $sectionTotals['exp_goods'] += $expGoods;
                $sectionTotals['exp_maintenance'] += $expMaint;
                $sectionTotals['exp_travel'] += $expTravel;
                $sectionTotals['exp_general'] += $expGeneral;
                $sectionTotals['exp_this_month'] += $expThisMonth;
                $sectionTotals['exp_prev_months'] += $expPrevMonths;
                $sectionTotals['exp_cumulative'] += $expCumulative;
                $sectionTotals['remaining'] += $remaining;
            }

            // Section absorption
            $sectionTotals['absorption_receipt'] = $sectionTotals['allocation'] > 0
                ? $sectionTotals['receipt_cumulative'] / $sectionTotals['allocation']
                : 0;
            $sectionTotals['absorption_expenditure'] = $sectionTotals['allocation'] > 0
                ? $sectionTotals['exp_cumulative'] / $sectionTotals['allocation']
                : 0;

            $sections[] = [
                'id' => $category->id,
                'roman' => $category->roman,
                'roman_number' => $category->roman_number,
                'name' => $category->name,
                'sub_label' => $category->sub_label,
                'rows' => $rows,
                'totals' => $sectionTotals,
            ];

            // Accumulate grand totals
            foreach (['allocation', 'receipt_this_month', 'receipt_cumulative',
                'exp_personnel', 'exp_goods', 'exp_maintenance', 'exp_travel',
                'exp_general', 'exp_this_month', 'exp_prev_months', 'exp_cumulative',
                'remaining'] as $key) {
                $grandTotals[$key] += $sectionTotals[$key];
            }
        }

        $grandTotals['absorption_receipt'] = $grandTotals['allocation'] > 0
            ? $grandTotals['receipt_cumulative'] / $grandTotals['allocation']
            : 0;
        $grandTotals['absorption_expenditure'] = $grandTotals['allocation'] > 0
            ? $grandTotals['exp_cumulative'] / $grandTotals['allocation']
            : 0;

        return [
            'sections' => $sections,
            'grand_totals' => $grandTotals,
        ];
    }
}
