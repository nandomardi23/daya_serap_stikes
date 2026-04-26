<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$c = new App\Http\Controllers\ReportController();
$fy = App\Models\FiscalYear::first();
if ($fy) {
    echo "Month 4 Receipt: " . $c->buildReportData($fy, 4)['grand_totals']['receipt_this_month'] . "\n";
    echo "Month 1 Receipt: " . $c->buildReportData($fy, 1)['grand_totals']['receipt_this_month'] . "\n";
} else {
    echo "No Fiscal Year found.";
}
