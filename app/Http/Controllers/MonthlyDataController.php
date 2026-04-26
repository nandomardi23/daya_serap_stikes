<?php

namespace App\Http\Controllers;

use App\Models\MonthlyData;
use App\Models\BudgetCategory;
use App\Models\BudgetItem;
use App\Models\FiscalYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MonthlyDataController extends Controller
{
    public function index(Request $request)
    {
        $fiscalYearId = $request->input('fiscal_year_id', FiscalYear::active()?->id);
        $month = (int) $request->input('month', now()->month);
        $categoryId = $request->input('category_id');

        $fiscalYear = $fiscalYearId ? FiscalYear::find($fiscalYearId) : null;
        $fiscalYears = FiscalYear::orderBy('year', 'desc')->get();

        $categories = $fiscalYear
            ? $fiscalYear->categories()->get()
            : collect();

        $category = $categoryId
            ? BudgetCategory::find($categoryId)
            : $categories->first();

        $items = collect();
        if ($category) {
            $items = $category->items()->get()->map(function ($item) use ($fiscalYearId, $month) {
                $monthlyData = MonthlyData::where('budget_item_id', $item->id)
                    ->where('fiscal_year_id', $fiscalYearId)
                    ->where('month', $month)
                    ->first();

                return [
                    'id' => $item->id,
                    'account_code' => $item->account_code,
                    'description' => $item->description,
                    'allocation' => (float) $item->allocation,
                    'monthly_data_id' => $monthlyData?->id,
                    'receipt_amount' => (float) ($monthlyData->receipt_amount ?? 0),
                    'exp_personnel' => (float) ($monthlyData->exp_personnel ?? 0),
                    'exp_goods' => (float) ($monthlyData->exp_goods ?? 0),
                    'exp_maintenance' => (float) ($monthlyData->exp_maintenance ?? 0),
                    'exp_travel' => (float) ($monthlyData->exp_travel ?? 0),
                    'exp_general' => (float) ($monthlyData->exp_general ?? 0),
                ];
            });
        }

        return Inertia::render('MonthlyData/Index', [
            'items' => $items,
            'category' => $category,
            'categories' => $categories,
            'fiscalYear' => $fiscalYear,
            'fiscalYears' => $fiscalYears,
            'month' => $month,
        ]);
    }

    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'fiscal_year_id' => 'required|exists:fiscal_years,id',
            'month' => 'required|integer|min:1|max:12',
            'data' => 'required|array',
            'data.*.budget_item_id' => 'required|exists:budget_items,id',
            'data.*.receipt_amount' => 'nullable|numeric|min:0',
            'data.*.exp_personnel' => 'nullable|numeric|min:0',
            'data.*.exp_goods' => 'nullable|numeric|min:0',
            'data.*.exp_maintenance' => 'nullable|numeric|min:0',
            'data.*.exp_travel' => 'nullable|numeric|min:0',
            'data.*.exp_general' => 'nullable|numeric|min:0',
        ]);

        foreach ($validated['data'] as $row) {
            MonthlyData::updateOrCreate(
                [
                    'budget_item_id' => $row['budget_item_id'],
                    'fiscal_year_id' => $validated['fiscal_year_id'],
                    'month' => $validated['month'],
                ],
                [
                    'receipt_amount' => $row['receipt_amount'] ?? 0,
                    'exp_personnel' => $row['exp_personnel'] ?? 0,
                    'exp_goods' => $row['exp_goods'] ?? 0,
                    'exp_maintenance' => $row['exp_maintenance'] ?? 0,
                    'exp_travel' => $row['exp_travel'] ?? 0,
                    'exp_general' => $row['exp_general'] ?? 0,
                ]
            );
        }

        return redirect()->back()->with('success', 'Data bulanan berhasil disimpan.');
    }
}
