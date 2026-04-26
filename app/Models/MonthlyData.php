<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MonthlyData extends Model
{
    use HasFactory;

    protected $table = 'monthly_data';

    protected $fillable = [
        'budget_item_id',
        'fiscal_year_id',
        'month',
        'receipt_amount',
        'exp_personnel',
        'exp_goods',
        'exp_maintenance',
        'exp_travel',
        'exp_general',
    ];

    protected $casts = [
        'receipt_amount' => 'decimal:2',
        'exp_personnel' => 'decimal:2',
        'exp_goods' => 'decimal:2',
        'exp_maintenance' => 'decimal:2',
        'exp_travel' => 'decimal:2',
        'exp_general' => 'decimal:2',
    ];

    public function budgetItem(): BelongsTo
    {
        return $this->belongsTo(BudgetItem::class);
    }

    public function fiscalYear(): BelongsTo
    {
        return $this->belongsTo(FiscalYear::class);
    }

    /**
     * Get total expenditure for this month.
     */
    public function getTotalExpenditureAttribute(): float
    {
        return (float) $this->exp_personnel
            + (float) $this->exp_goods
            + (float) $this->exp_maintenance
            + (float) $this->exp_travel
            + (float) $this->exp_general;
    }

    /**
     * Month name in Indonesian.
     */
    public function getMonthNameAttribute(): string
    {
        $months = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret',
            4 => 'April', 5 => 'Mei', 6 => 'Juni',
            7 => 'Juli', 8 => 'Agustus', 9 => 'September',
            10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        return $months[$this->month] ?? '';
    }
}
