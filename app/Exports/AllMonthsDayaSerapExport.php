<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use App\Models\FiscalYear;

class AllMonthsDayaSerapExport implements WithMultipleSheets
{
    use Exportable;

    protected array $allMonthsData;
    protected FiscalYear $fiscalYear;
    protected $signatories;

    public function __construct(array $allMonthsData, FiscalYear $fiscalYear, $signatories)
    {
        $this->allMonthsData = $allMonthsData;
        $this->fiscalYear = $fiscalYear;
        $this->signatories = $signatories;
    }

    public function sheets(): array
    {
        $sheets = [];

        foreach ($this->allMonthsData as $month => $reportData) {
            $sheets[] = new DayaSerapExport($reportData, $this->fiscalYear, $month, $this->signatories);
        }

        return $sheets;
    }
}
