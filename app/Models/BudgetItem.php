<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BudgetItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'budget_category_id',
        'account_code',
        'description',
        'allocation',
        'sort_order',
    ];

    protected $casts = [
        'allocation' => 'decimal:2',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(BudgetCategory::class, 'budget_category_id');
    }

    public function monthlyData(): HasMany
    {
        return $this->hasMany(MonthlyData::class);
    }

    /**
     * Get monthly data for a specific month.
     */
    public function getDataForMonth(int $month): ?MonthlyData
    {
        return $this->monthlyData()->where('month', $month)->first();
    }

    /**
     * Get cumulative receipt up to a given month.
     */
    public function getCumulativeReceipt(int $upToMonth): float
    {
        return (float) $this->monthlyData()
            ->where('month', '<=', $upToMonth)
            ->sum('receipt_amount');
    }

    /**
     * Get cumulative expenditure up to a given month.
     */
    public function getCumulativeExpenditure(int $upToMonth): float
    {
        return (float) $this->monthlyData()
            ->where('month', '<=', $upToMonth)
            ->selectRaw('SUM(exp_personnel + exp_goods + exp_maintenance + exp_travel + exp_general) as total')
            ->value('total') ?? 0;
    }

    /**
     * Get previous months' cumulative expenditure (before current month).
     */
    public function getPreviousExpenditure(int $currentMonth): float
    {
        if ($currentMonth <= 1) return 0;

        return (float) $this->monthlyData()
            ->where('month', '<', $currentMonth)
            ->selectRaw('SUM(exp_personnel + exp_goods + exp_maintenance + exp_travel + exp_general) as total')
            ->value('total') ?? 0;
    }
}
