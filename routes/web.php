<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FiscalYearController;
use App\Http\Controllers\BudgetCategoryController;
use App\Http\Controllers\BudgetItemController;
use App\Http\Controllers\MonthlyDataController;
use App\Http\Controllers\SignatoryController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Fiscal Years
    Route::resource('fiscal-years', FiscalYearController::class)->except(['create', 'edit', 'show']);
    Route::post('fiscal-years/{fiscalYear}/activate', [FiscalYearController::class, 'activate'])
        ->name('fiscal-years.activate');

    // Budget Categories
    Route::resource('budget-categories', BudgetCategoryController::class)->except(['create', 'edit', 'show']);

    // Budget Items
    Route::resource('budget-items', BudgetItemController::class)->except(['create', 'edit', 'show']);

    // Monthly Data
    Route::get('monthly-data', [MonthlyDataController::class, 'index'])->name('monthly-data.index');
    Route::post('monthly-data/bulk', [MonthlyDataController::class, 'bulkStore'])->name('monthly-data.bulk-store');

    // Reports
    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('reports/export', [ReportController::class, 'export'])->name('reports.export');

    // Signatories
    Route::resource('signatories', SignatoryController::class)->except(['create', 'edit', 'show']);

    // User Management
    Route::middleware(['role:admin'])->group(function () {
        Route::resource('users', UserController::class)->except(['create', 'edit', 'show']);
        Route::resource('roles', RoleController::class)->except(['create', 'edit', 'show']);
        Route::resource('permissions', PermissionController::class)->except(['create', 'edit', 'show']);
    });
});

require __DIR__.'/auth.php';
