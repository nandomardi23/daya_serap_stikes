<?php

namespace App\Http\Controllers;

use App\Models\FiscalYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FiscalYearController extends Controller
{
    public function index()
    {
        $fiscalYears = FiscalYear::withCount('categories')
            ->latest()
            ->get();

        return Inertia::render('FiscalYear/Index', [
            'fiscalYears' => $fiscalYears,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'year' => ['required', 'string', 'max:9', 'unique:fiscal_years,year', 'regex:/^\d{4}\/\d{4}$/'],
            'start_month' => 'required|integer|min:1|max:12',
            'label' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ], [
            'year.regex' => 'Format tahun anggaran harus YYYY/YYYY (contoh: 2025/2026).',
        ]);

        // Auto-generate label if not provided
        if (empty($validated['label'])) {
            $validated['label'] = 'TA ' . $validated['year'];
        }

        $fiscalYear = FiscalYear::create($validated);

        if ($validated['is_active'] ?? false) {
            $fiscalYear->activate();
        }

        return redirect()->route('fiscal-years.index')
            ->with('success', 'Tahun anggaran berhasil ditambahkan.');
    }

    public function update(Request $request, FiscalYear $fiscalYear)
    {
        $validated = $request->validate([
            'year' => ['required', 'string', 'max:9', 'unique:fiscal_years,year,' . $fiscalYear->id, 'regex:/^\d{4}\/\d{4}$/'],
            'start_month' => 'required|integer|min:1|max:12',
            'label' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ], [
            'year.regex' => 'Format tahun anggaran harus YYYY/YYYY (contoh: 2025/2026).',
        ]);

        // Auto-generate label if not provided
        if (empty($validated['label'])) {
            $validated['label'] = 'TA ' . $validated['year'];
        }

        $fiscalYear->update($validated);

        if ($validated['is_active'] ?? false) {
            $fiscalYear->activate();
        }

        return redirect()->route('fiscal-years.index')
            ->with('success', 'Tahun anggaran berhasil diperbarui.');
    }

    public function destroy(FiscalYear $fiscalYear)
    {
        $fiscalYear->delete();

        return redirect()->route('fiscal-years.index')
            ->with('success', 'Tahun anggaran berhasil dihapus.');
    }

    public function activate(FiscalYear $fiscalYear)
    {
        $fiscalYear->activate();

        return redirect()->route('fiscal-years.index')
            ->with('success', 'Tahun anggaran berhasil diaktifkan.');
    }
}
