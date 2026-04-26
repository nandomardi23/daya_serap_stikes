<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FiscalYear extends Model
{
    use HasFactory;

    protected $fillable = [
        'year',
        'start_month',
        'label',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'start_month' => 'integer',
    ];

    /**
     * Auto-generate label from year if not set.
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            if (empty($model->label) && !empty($model->year)) {
                $model->label = 'TA ' . $model->year;
            }
        });
    }

    public function categories(): HasMany
    {
        return $this->hasMany(BudgetCategory::class)->orderBy('sort_order');
    }

    public function monthlyData(): HasMany
    {
        return $this->hasMany(MonthlyData::class);
    }

    /**
     * Set this fiscal year as active (deactivate others).
     */
    public function activate(): void
    {
        static::where('id', '!=', $this->id)->update(['is_active' => false]);
        $this->update(['is_active' => true]);
    }

    /**
     * Get the currently active fiscal year.
     */
    public static function active(): ?self
    {
        return static::where('is_active', true)->first();
    }

    /**
     * Get array of month indices in fiscal order.
     */
    public function getFiscalMonths(): array
    {
        $start = $this->start_month ?: 1;
        $months = [];
        for ($i = 0; $i < 12; $i++) {
            $month = $start + $i;
            if ($month > 12) {
                $month -= 12;
            }
            $months[] = $month;
        }
        return $months;
    }
}
