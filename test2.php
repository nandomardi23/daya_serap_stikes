<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$request4 = Illuminate\Http\Request::create('/monthly-data', 'GET', ['month' => 4]);
$request1 = Illuminate\Http\Request::create('/monthly-data', 'GET', ['month' => 1]);

$c = new App\Http\Controllers\MonthlyDataController();

$res4 = $c->index($request4);
$res1 = $c->index($request1);

$items4 = $res4->toResponse($request4)->getOriginalContent()->getData()['page']['props']['items'];
$items1 = $res1->toResponse($request1)->getOriginalContent()->getData()['page']['props']['items'];

echo "Month 4 receipt: " . collect($items4)->sum('receipt_amount') . "\n";
echo "Month 1 receipt: " . collect($items1)->sum('receipt_amount') . "\n";
