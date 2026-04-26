<?php

namespace App\Http\Controllers;

use App\Models\BudgetItem;
use App\Models\BudgetCategory;
use App\Models\FiscalYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BudgetItemController extends Controller
{
    public function index(Request $request)
    {
        $categoryId = $request->input('category_id');
        $fiscalYearId = $request->input('fiscal_year_id', FiscalYear::active()?->id);

        $fiscalYear = $fiscalYearId ? FiscalYear::find($fiscalYearId) : null;
        $categories = $fiscalYear
            ? $fiscalYear->categories()->get()
            : collect();

        $category = $categoryId ? BudgetCategory::find($categoryId) : $categories->first();

        $items = $category
            ? $category->items()->withCount('monthlyData')->get()
            : collect();

        $fiscalYears = FiscalYear::orderBy('year', 'desc')->get();

        return Inertia::render('BudgetItem/Index', [
            'items' => $items,
            'category' => $category,
            'categories' => $categories,
            'fiscalYear' => $fiscalYear,
            'fiscalYears' => $fiscalYears,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'budget_category_id' => 'required|exists:budget_categories,id',
            'account_code' => 'nullable|string|max:50',
            'description' => 'required|string|max:500',
            'allocation' => 'required|numeric|min:0',
            'sort_order' => 'integer|min:0',
        ]);

        BudgetItem::create($validated);

        $category = BudgetCategory::find($validated['budget_category_id']);

        return redirect()->route('budget-items.index', [
            'category_id' => $validated['budget_category_id'],
            'fiscal_year_id' => $category->fiscal_year_id,
        ])->with('success', 'Item anggaran berhasil ditambahkan.');
    }

    public function update(Request $request, BudgetItem $budgetItem)
    {
        $validated = $request->validate([
            'budget_category_id' => 'required|exists:budget_categories,id',
            'account_code' => 'nullable|string|max:50',
            'description' => 'required|string|max:500',
            'allocation' => 'required|numeric|min:0',
            'sort_order' => 'integer|min:0',
        ]);

        $budgetItem->update($validated);

        $category = BudgetCategory::find($validated['budget_category_id']);

        return redirect()->route('budget-items.index', [
            'category_id' => $validated['budget_category_id'],
            'fiscal_year_id' => $category->fiscal_year_id,
        ])->with('success', 'Item anggaran berhasil diperbarui.');
    }

    public function destroy(BudgetItem $budgetItem)
    {
        $categoryId = $budgetItem->budget_category_id;
        $fiscalYearId = $budgetItem->category->fiscal_year_id;
        $budgetItem->delete();

        return redirect()->route('budget-items.index', [
            'category_id' => $categoryId,
            'fiscal_year_id' => $fiscalYearId,
        ])->with('success', 'Item anggaran berhasil dihapus.');
    }
}
