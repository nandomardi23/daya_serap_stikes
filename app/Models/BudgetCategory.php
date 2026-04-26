<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BudgetCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'fiscal_year_id',
        'roman_number',
        'name',
        'sub_label',
        'sort_order',
    ];

    /**
     * Roman numeral mapping.
     */
    public const ROMAN_NUMERALS = [
        1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV',
        5 => 'V', 6 => 'VI', 7 => 'VII', 8 => 'VIII',
        9 => 'IX', 10 => 'X',
    ];

    public function fiscalYear(): BelongsTo
    {
        return $this->belongsTo(FiscalYear::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(BudgetItem::class)->orderBy('sort_order');
    }

    /**
     * Get the roman numeral representation.
     */
    public function getRomanAttribute(): string
    {
        return self::ROMAN_NUMERALS[$this->roman_number] ?? (string) $this->roman_number;
    }
}
