<?php

namespace App\Http\Controllers;

use App\Models\Signatory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SignatoryController extends Controller
{
    public function index()
    {
        $signatories = Signatory::orderBy('sort_order')->get();

        return Inertia::render('Signatory/Index', [
            'signatories' => $signatories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'position' => 'required|string|max:50',
            'position_label' => 'required|string|max:100',
            'name' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'rank' => 'nullable|string|max:255',
            'nik' => 'nullable|string|max:50',
            'institution' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:100',
            'sort_order' => 'integer|min:0',
        ]);

        Signatory::create($validated);

        return redirect()->route('signatories.index')
            ->with('success', 'Penandatangan berhasil ditambahkan.');
    }

    public function update(Request $request, Signatory $signatory)
    {
        $validated = $request->validate([
            'position' => 'required|string|max:50',
            'position_label' => 'required|string|max:100',
            'name' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'rank' => 'nullable|string|max:255',
            'nik' => 'nullable|string|max:50',
            'institution' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:100',
            'sort_order' => 'integer|min:0',
        ]);

        $signatory->update($validated);

        return redirect()->route('signatories.index')
            ->with('success', 'Penandatangan berhasil diperbarui.');
    }

    public function destroy(Signatory $signatory)
    {
        $signatory->delete();

        return redirect()->route('signatories.index')
            ->with('success', 'Penandatangan berhasil dihapus.');
    }
}
