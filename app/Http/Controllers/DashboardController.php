<?php

namespace App\Http\Controllers;

use App\Models\FiscalYear;
use App\Models\BudgetCategory;
use App\Models\MonthlyData;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $fiscalYear = FiscalYear::active();

        $data = [
            'fiscalYear' => $fiscalYear,
            'summary' => null,
        ];

        if ($fiscalYear) {
            $reportController = new \App\Http\Controllers\ReportController();
            $month = 12; // Always fetch full year (12 months) for the Dashboard
            $reportData = $reportController->buildReportData($fiscalYear, $month);

            $grandTotals = $reportData['grand_totals'];

            $data['reportData'] = $reportData;
            $data['month'] = $month;

            $data['summary'] = [
                'total_allocation' => $grandTotals['allocation'],
                'total_receipt' => $grandTotals['receipt_cumulative'],
                'total_expenditure' => $grandTotals['exp_cumulative'],
                'absorption_receipt' => $grandTotals['absorption_receipt'] * 100,
                'absorption_expenditure' => $grandTotals['absorption_expenditure'] * 100,
                'remaining' => $grandTotals['remaining'],
                'category_stats' => [], // Unused now
            ];
        }

        return Inertia::render('Dashboard', $data);
    }
}
