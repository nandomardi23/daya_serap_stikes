<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Illuminate\Support\Collection;

class DayaSerapExport implements WithEvents, WithTitle
{
    protected array $reportData;
    protected $fiscalYear;
    protected int $month;
    protected $signatories;

    protected const MONTH_NAMES = [
        1 => 'Januari', 2 => 'Februari', 3 => 'Maret',
        4 => 'April', 5 => 'Mei', 6 => 'Juni',
        7 => 'Juli', 8 => 'Agustus', 9 => 'September',
        10 => 'Oktober', 11 => 'November', 12 => 'Desember',
    ];

    // Column mapping (A=1, B=2, ...)
    protected const COL_NO = 'A';           // 1
    protected const COL_CODE = 'B';         // 2
    protected const COL_DESC = 'C';         // 3
    protected const COL_ALLOC = 'D';        // 4
    protected const COL_REC_MONTH = 'E';    // 5 - Penerimaan Bulan ini
    protected const COL_REC_CUM = 'F';      // 6 - Penerimaan s/d Bulan ini
    protected const COL_EXP_PERS = 'G';     // 7 - Pengeluaran: Pers
    protected const COL_EXP_GOODS = 'H';    // 8 - Pengeluaran: Barang
    protected const COL_EXP_MAINT = 'I';    // 9 - Pengeluaran: Har
    protected const COL_EXP_TRAVEL = 'J';   // 10 - Pengeluaran: Jaldis
    protected const COL_EXP_GEN = 'K';      // 11 - Pengeluaran: Umum
    protected const COL_TOTAL_MONTH = 'L';  // 12 - Jumlah Bln Ini
    protected const COL_TOTAL_PREV = 'M';   // 13 - Jumlah Bln Lalu
    protected const COL_TOTAL_CUM = 'N';    // 14 - Jumlah s/d Bln Ini
    protected const COL_ABS_REC = 'O';      // 15 - Daya Serap Penerimaan
    protected const COL_ABS_EXP = 'P';      // 16 - Daya Serap Pengeluaran
    protected const COL_REMAINING = 'Q';    // 17 - Sisa Anggaran
    protected const COL_MONTH_NUM = 'R';    // 18 - BULAN
    protected const COL_PERS_PCT = 'S';     // 19 - PERS%

    public function __construct(array $reportData, $fiscalYear, int $month, $signatories)
    {
        $this->reportData = $reportData;
        $this->fiscalYear = $fiscalYear;
        $this->month = $month;
        $this->signatories = $signatories;
    }

    public function title(): string
    {
        return self::MONTH_NAMES[$this->month] ?? 'Daya Serap';
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                $this->setColumnWidths($sheet);
                $currentRow = $this->writeHeader($sheet);
                $currentRow = $this->writeData($sheet, $currentRow);
                $this->writeSignatures($sheet, $currentRow + 2);

                // Set print settings
                $sheet->getPageSetup()->setOrientation(\PhpOffice\PhpSpreadsheet\Worksheet\PageSetup::ORIENTATION_LANDSCAPE);
                $sheet->getPageSetup()->setPaperSize(\PhpOffice\PhpSpreadsheet\Worksheet\PageSetup::PAPERSIZE_LEGAL);
                $sheet->getPageSetup()->setFitToWidth(1);
                $sheet->getPageSetup()->setFitToHeight(0);
            },
        ];
    }

    private function setColumnWidths(Worksheet $sheet): void
    {
        $widths = [
            'A' => 4,   // No
            'B' => 22,  // Kode Akun
            'C' => 40,  // Uraian
            'D' => 16,  // Alokasi
            'E' => 14,  // Penerimaan Bulan ini
            'F' => 14,  // Penerimaan s/d Bulan
            'G' => 14,  // Pers
            'H' => 14,  // Barang
            'I' => 14,  // Har
            'J' => 12,  // Jaldis
            'K' => 12,  // Umum
            'L' => 14,  // Bln Ini
            'M' => 14,  // Bln Lalu
            'N' => 15,  // s/d Bln Ini
            'O' => 8,   // Daya Serap Penerimaan
            'P' => 8,   // Daya Serap Pengeluaran
            'Q' => 16,  // Sisa Anggaran
            'R' => 8,   // BULAN
            'S' => 8,   // PERS%
        ];

        foreach ($widths as $col => $width) {
            $sheet->getColumnDimension($col)->setWidth($width);
        }
    }

    private function writeHeader(Worksheet $sheet): int
    {
        $row = 1;

        // Row 1: Main header merged cells
        $sheet->mergeCells("A{$row}:A" . ($row + 2));
        $sheet->setCellValue("A{$row}", 'No');

        $sheet->mergeCells("B{$row}:B" . ($row + 2));
        $sheet->setCellValue("B{$row}", '');

        $sheet->mergeCells("C{$row}:C" . ($row + 2));
        $sheet->setCellValue("C{$row}", 'Uraian');

        $sheet->mergeCells("D{$row}:D" . ($row + 2));
        $sheet->setCellValue("D{$row}", 'Alokasi');

        // Penerimaan Dari Yayasan
        $sheet->mergeCells("E{$row}:F{$row}");
        $sheet->setCellValue("E{$row}", 'Penerimaan Dari Yayasan');

        // Pengeluaran (big header)
        $sheet->mergeCells("G{$row}:N{$row}");
        $sheet->setCellValue("G{$row}", 'Pengeluaran');

        // Daya Serap
        $sheet->mergeCells("O{$row}:P{$row}");
        $sheet->setCellValue("O{$row}", 'Daya Serap');

        $sheet->mergeCells("Q{$row}:Q" . ($row + 2));
        $sheet->setCellValue("Q{$row}", 'Sisa Anggaran');

        // BULAN & PERS%
        $sheet->mergeCells("R{$row}:R" . ($row + 2));
        $sheet->setCellValue("R{$row}", 'BULAN');

        $sheet->mergeCells("S{$row}:S" . ($row + 2));
        $sheet->setCellValue("S{$row}", 'PERS%');

        // Row 2: Sub-headers
        $row2 = $row + 1;

        $sheet->mergeCells("E{$row2}:E" . ($row2 + 1));
        $sheet->setCellValue("E{$row2}", 'Bulan ini');

        $sheet->mergeCells("F{$row2}:F" . ($row2 + 1));
        $sheet->setCellValue("F{$row2}", 's/d Bulan ini');

        // Jenis Anggaran
        $sheet->mergeCells("G{$row2}:K{$row2}");
        $sheet->setCellValue("G{$row2}", 'Jenis Anggaran');

        // Jumlah Anggaran
        $sheet->mergeCells("L{$row2}:N{$row2}");
        $sheet->setCellValue("L{$row2}", 'Jumlah Anggaran');

        $sheet->mergeCells("O{$row2}:O" . ($row2 + 1));
        $sheet->setCellValue("O{$row2}", 'Penerimaan');

        $sheet->mergeCells("P{$row2}:P" . ($row2 + 1));
        $sheet->setCellValue("P{$row2}", 'Pengeluaran');

        // Row 3: Detail headers
        $row3 = $row + 2;

        $sheet->setCellValue("G{$row3}", 'Pers');
        $sheet->setCellValue("H{$row3}", 'Barang');
        $sheet->setCellValue("I{$row3}", 'Har');
        $sheet->setCellValue("J{$row3}", 'Jaldis');
        $sheet->setCellValue("K{$row3}", 'Umum');
        $sheet->setCellValue("L{$row3}", 'Bln Ini');
        $sheet->setCellValue("M{$row3}", 'Bln Lalu');
        $sheet->setCellValue("N{$row3}", 's/d Bln Ini');

        // Style the header
        $headerRange = "A1:S3";
        $sheet->getStyle($headerRange)->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 9,
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                ],
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'D9E1F2'],
            ],
        ]);

        return 4; // Data starts at row 4
    }

    private function writeData(Worksheet $sheet, int $startRow): int
    {
        $currentRow = $startRow;
        $sections = $this->reportData['sections'];
        $sectionCount = count($sections);
        
        $subtotalRows = [];

        foreach ($sections as $sIdx => $section) {
            // Section header row
            $sheet->mergeCells("A{$currentRow}:B{$currentRow}");
            $sheet->setCellValue("A{$currentRow}", $section['roman']);

            $sheet->mergeCells("C{$currentRow}:S{$currentRow}");
            $label = $section['sub_label']
                ? strtoupper($section['sub_label']) . "\n" . strtoupper($section['name'])
                : strtoupper($section['name']);
            $sheet->setCellValue("C{$currentRow}", $label);

            $sheet->getStyle("A{$currentRow}:S{$currentRow}")->applyFromArray([
                'font' => ['bold' => true, 'size' => 9],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'E2EFDA']],
            ]);

            $currentRow++;
            $sectionStartRow = $currentRow;

            // Data rows
            foreach ($section['rows'] as $rowIdx => $row) {
                $rowNum = $rowIdx + 1;

                $sheet->setCellValue("A{$currentRow}", $rowNum);
                $sheet->setCellValue("B{$currentRow}", $row['account_code'] ?? '');
                $sheet->setCellValue("C{$currentRow}", $row['description']);
                $sheet->setCellValue("D{$currentRow}", $row['allocation'] ?: 0);
                $sheet->setCellValue("E{$currentRow}", $row['receipt_this_month'] ?: 0);
                $sheet->setCellValue("F{$currentRow}", $row['receipt_cumulative'] ?: 0);
                $sheet->setCellValue("G{$currentRow}", $row['exp_personnel'] ?: 0);
                $sheet->setCellValue("H{$currentRow}", $row['exp_goods'] ?: 0);
                $sheet->setCellValue("I{$currentRow}", $row['exp_maintenance'] ?: 0);
                $sheet->setCellValue("J{$currentRow}", $row['exp_travel'] ?: 0);
                $sheet->setCellValue("K{$currentRow}", $row['exp_general'] ?: 0);
                
                // Formulas for the row
                // L = SUM(G:K)
                $sheet->setCellValue("L{$currentRow}", "=SUM(G{$currentRow}:K{$currentRow})");
                // M = Previous months (static from DB)
                $sheet->setCellValue("M{$currentRow}", $row['exp_prev_months'] ?: 0);
                // N = L + M
                $sheet->setCellValue("N{$currentRow}", "=L{$currentRow}+M{$currentRow}");
                
                // Percentages (O, P, S) formatted as Percentage
                $sheet->setCellValue("O{$currentRow}", "=IF(D{$currentRow}>0, F{$currentRow}/D{$currentRow}, 0)");
                $sheet->setCellValue("P{$currentRow}", "=IF(D{$currentRow}>0, N{$currentRow}/D{$currentRow}, 0)");
                
                // Q = D - N
                $sheet->setCellValue("Q{$currentRow}", "=D{$currentRow}-N{$currentRow}");
                $sheet->setCellValue("R{$currentRow}", $row['month_number']);
                $sheet->setCellValue("S{$currentRow}", "=IF(D{$currentRow}>0, N{$currentRow}/D{$currentRow}, 0)");

                // Style data row
                $sheet->getStyle("A{$currentRow}:S{$currentRow}")->applyFromArray([
                    'font' => ['size' => 8],
                    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
                    'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
                ]);

                // Number format for currency columns
                foreach (['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Q'] as $col) {
                    $sheet->getStyle("{$col}{$currentRow}")->getNumberFormat()
                        ->setFormatCode('#,##0');
                }

                // Format percentages
                foreach (['O', 'P', 'S'] as $col) {
                    $sheet->getStyle("{$col}{$currentRow}")->getNumberFormat()
                        ->setFormatCode(NumberFormat::FORMAT_PERCENTAGE);
                    $sheet->getStyle("{$col}{$currentRow}")->getAlignment()
                        ->setHorizontal(Alignment::HORIZONTAL_CENTER);
                }

                // Center align specific columns
                foreach (['A', 'R'] as $col) {
                    $sheet->getStyle("{$col}{$currentRow}")->getAlignment()
                        ->setHorizontal(Alignment::HORIZONTAL_CENTER);
                }

                $currentRow++;
            }
            $sectionEndRow = $currentRow - 1;

            // Section subtotal row
            $subtotalRows[] = $currentRow;

            $sheet->mergeCells("A{$currentRow}:C{$currentRow}");
            $sheet->setCellValue("A{$currentRow}", "JUMLAH {$section['roman']}");
            
            // Subtotal formulas
            if ($sectionStartRow <= $sectionEndRow) {
                foreach (['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'] as $col) {
                    $sheet->setCellValue("{$col}{$currentRow}", "=SUM({$col}{$sectionStartRow}:{$col}{$sectionEndRow})");
                }
            } else {
                foreach (['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'] as $col) {
                    $sheet->setCellValue("{$col}{$currentRow}", 0);
                }
            }

            $sheet->setCellValue("O{$currentRow}", "=IF(D{$currentRow}>0, F{$currentRow}/D{$currentRow}, 0)");
            $sheet->setCellValue("P{$currentRow}", "=IF(D{$currentRow}>0, N{$currentRow}/D{$currentRow}, 0)");
            $sheet->setCellValue("Q{$currentRow}", "=D{$currentRow}-N{$currentRow}");

            // Style subtotal
            $sheet->getStyle("A{$currentRow}:S{$currentRow}")->applyFromArray([
                'font' => ['bold' => true, 'size' => 9],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'FCE4D6']],
            ]);

            foreach (['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Q'] as $col) {
                $sheet->getStyle("{$col}{$currentRow}")->getNumberFormat()
                    ->setFormatCode('#,##0');
            }

            foreach (['O', 'P'] as $col) {
                $sheet->getStyle("{$col}{$currentRow}")->getNumberFormat()
                    ->setFormatCode(NumberFormat::FORMAT_PERCENTAGE);
                $sheet->getStyle("{$col}{$currentRow}")->getAlignment()
                    ->setHorizontal(Alignment::HORIZONTAL_CENTER);
            }

            $currentRow++;
        }

        // Grand Total row
        $sheet->mergeCells("A{$currentRow}:C{$currentRow}");
        $sheet->setCellValue("A{$currentRow}", 'GRAND TOTAL I+II+III+IV+V+VI+VII');
        
        if (count($subtotalRows) > 0) {
            foreach (['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'] as $col) {
                $formulaArgs = implode(',', array_map(fn($r) => "{$col}{$r}", $subtotalRows));
                $sheet->setCellValue("{$col}{$currentRow}", "=SUM({$formulaArgs})");
            }
        } else {
            foreach (['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'] as $col) {
                $sheet->setCellValue("{$col}{$currentRow}", 0);
            }
        }

        $sheet->setCellValue("O{$currentRow}", "=IF(D{$currentRow}>0, F{$currentRow}/D{$currentRow}, 0)");
        $sheet->setCellValue("P{$currentRow}", "=IF(D{$currentRow}>0, N{$currentRow}/D{$currentRow}, 0)");
        $sheet->setCellValue("Q{$currentRow}", "=D{$currentRow}-N{$currentRow}");

        // Style grand total
        $sheet->getStyle("A{$currentRow}:S{$currentRow}")->applyFromArray([
            'font' => ['bold' => true, 'size' => 10],
            'borders' => [
                'allBorders' => ['borderStyle' => Border::BORDER_MEDIUM],
            ],
            'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'DDEBF7']],
        ]);

        foreach (['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Q'] as $col) {
            $sheet->getStyle("{$col}{$currentRow}")->getNumberFormat()
                ->setFormatCode('#,##0');
        }

        foreach (['O', 'P'] as $col) {
            $sheet->getStyle("{$col}{$currentRow}")->getNumberFormat()
                ->setFormatCode(NumberFormat::FORMAT_PERCENTAGE);
            $sheet->getStyle("{$col}{$currentRow}")->getAlignment()
                ->setHorizontal(Alignment::HORIZONTAL_CENTER);
        }

        return $currentRow;
    }

    private function writeSignatures(Worksheet $sheet, int $startRow): void
    {
        $row = $startRow + 1;
        $monthName = self::MONTH_NAMES[$this->month] ?? '';

        // Get signatories
        $waket = $this->signatories->firstWhere('position', 'waket_2');
        $kaBiro = $this->signatories->firstWhere('position', 'ka_biro_keuangan');
        $ketua = $this->signatories->firstWhere('position', 'ketua');

        // Left side - Waket II
        if ($waket) {
            $sheet->mergeCells("B{$row}:D{$row}");
            $sheet->setCellValue("B{$row}", $waket->position_label);
            $sheet->getStyle("B{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

            $nameRow = $row + 3;
            $sheet->mergeCells("B{$nameRow}:D{$nameRow}");
            $fullName = trim(($waket->title ? $waket->title . ' ' : '') . $waket->name);
            $sheet->setCellValue("B{$nameRow}", $fullName);
            $sheet->getStyle("B{$nameRow}")->applyFromArray([
                'font' => ['bold' => true, 'underline' => true],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ]);

            if ($waket->nik) {
                $nikRow = $nameRow + 1;
                $sheet->mergeCells("B{$nikRow}:D{$nikRow}");
                $sheet->setCellValue("B{$nikRow}", "NIK. {$waket->nik}");
                $sheet->getStyle("B{$nikRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            }
        }

        // Right side - Ka Biro Keuangan
        if ($kaBiro) {
            $locationStr = ($kaBiro->location ?? 'Tanjungpinang') . ',    ' . $monthName . '  ' . date('Y');
            $sheet->mergeCells("N{$row}:S{$row}");
            $sheet->setCellValue("N{$row}", $locationStr);
            $sheet->getStyle("N{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

            $posRow = $row + 1;
            $sheet->mergeCells("N{$posRow}:S{$posRow}");
            $sheet->setCellValue("N{$posRow}", $kaBiro->position_label);
            $sheet->getStyle("N{$posRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

            $nameRow = $row + 3;
            $sheet->mergeCells("N{$nameRow}:S{$nameRow}");
            $fullName = trim(($kaBiro->title ? $kaBiro->title . ' ' : '') . $kaBiro->name);
            $sheet->setCellValue("N{$nameRow}", $fullName);
            $sheet->getStyle("N{$nameRow}")->applyFromArray([
                'font' => ['bold' => true, 'underline' => true],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ]);

            if ($kaBiro->nik) {
                $nikRow = $nameRow + 1;
                $sheet->mergeCells("N{$nikRow}:S{$nikRow}");
                $sheet->setCellValue("N{$nikRow}", "NIK. {$kaBiro->nik}");
                $sheet->getStyle("N{$nikRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            }
        }

        // Center - Ketua (Mengetahui)
        if ($ketua) {
            $mengetahuiRow = $row + 6;
            $sheet->mergeCells("G{$mengetahuiRow}:L{$mengetahuiRow}");
            $sheet->setCellValue("G{$mengetahuiRow}", 'Mengetahui');
            $sheet->getStyle("G{$mengetahuiRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

            $instRow = $mengetahuiRow + 1;
            $sheet->mergeCells("G{$instRow}:L{$instRow}");
            $sheet->setCellValue("G{$instRow}", $ketua->institution ?? 'STIKES Hang Tuah Tanjungpinang');
            $sheet->getStyle("G{$instRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

            $posRow = $mengetahuiRow + 2;
            $sheet->mergeCells("G{$posRow}:L{$posRow}");
            $sheet->setCellValue("G{$posRow}", $ketua->position_label);
            $sheet->getStyle("G{$posRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

            $nameRow = $mengetahuiRow + 5;
            $sheet->mergeCells("G{$nameRow}:L{$nameRow}");
            $fullName = trim(($ketua->rank ? $ketua->rank . ' ' : '') . ($ketua->title ? $ketua->title . ' ' : '') . $ketua->name);
            $sheet->setCellValue("G{$nameRow}", $fullName);
            $sheet->getStyle("G{$nameRow}")->applyFromArray([
                'font' => ['bold' => true, 'underline' => true],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ]);

            if ($ketua->rank) {
                $rankRow = $nameRow + 1;
                $sheet->mergeCells("G{$rankRow}:L{$rankRow}");
                $sheet->setCellValue("G{$rankRow}", $ketua->rank);
                $sheet->getStyle("G{$rankRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            }

            if ($ketua->nik) {
                $nikRow = $nameRow + 2;
                $sheet->mergeCells("G{$nikRow}:L{$nikRow}");
                $sheet->setCellValue("G{$nikRow}", "NIK. {$ketua->nik}");
                $sheet->getStyle("G{$nikRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            }
        }
    }
}

/**
 * Helper to get roman numeral label (not used as method here but kept for reference).
 */
function BudgetCategoryRomanLabel(int $number): string
{
    $numerals = [1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV', 5 => 'V', 6 => 'VI', 7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X'];
    return $numerals[$number] ?? (string) $number;
}
