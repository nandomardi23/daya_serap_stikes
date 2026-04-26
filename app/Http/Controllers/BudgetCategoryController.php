<?php

namespace App\Http\Controllers;

use App\Models\BudgetCategory;
use App\Models\FiscalYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BudgetCategoryController extends Controller
{
    public function index(Request $request)
    {
        $fiscalYearId = $request->input('fiscal_year_id', FiscalYear::active()?->id);
        $fiscalYear = $fiscalYearId ? FiscalYear::find($fiscalYearId) : null;

        $categories = $fiscalYear
            ? $fiscalYear->categories()->withCount('items')->get()
            : collect();

        $fiscalYears = FiscalYear::orderBy('year', 'desc')->get();

        return Inertia::render('BudgetCategory/Index', [
            'categories' => $categories,
            'fiscalYear' => $fiscalYear,
            'fiscalYears' => $fiscalYears,
        ]);
    }



    public function store(Request $request)
    {
        $validated = $request->validate([
            'fiscal_year_id' => 'required|exists:fiscal_years,id',
            'roman_number' => 'required|integer|min:1|max:20',
            'name' => 'required|string|max:255',
            'sub_label' => 'nullable|string|max:255',
            'sort_order' => 'integer|min:0',
        ]);

        BudgetCategory::create($validated);

        return redirect()->route('budget-categories.index', [
            'fiscal_year_id' => $validated['fiscal_year_id'],
        ])->with('success', 'Kategori belanja berhasil ditambahkan.');
    }



    public function update(Request $request, BudgetCategory $budgetCategory)
    {
        $validated = $request->validate([
            'fiscal_year_id' => 'required|exists:fiscal_years,id',
            'roman_number' => 'required|integer|min:1|max:20',
            'name' => 'required|string|max:255',
            'sub_label' => 'nullable|string|max:255',
            'sort_order' => 'integer|min:0',
        ]);

        $budgetCategory->update($validated);

        return redirect()->route('budget-categories.index', [
            'fiscal_year_id' => $validated['fiscal_year_id'],
        ])->with('success', 'Kategori belanja berhasil diperbarui.');
    }

    public function destroy(BudgetCategory $budgetCategory)
    {
        $fiscalYearId = $budgetCategory->fiscal_year_id;
        $budgetCategory->delete();

        return redirect()->route('budget-categories.index', [
            'fiscal_year_id' => $fiscalYearId,
        ])->with('success', 'Kategori belanja berhasil dihapus.');
    }
}
