<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('monthly_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('budget_item_id')->constrained()->cascadeOnDelete();
            $table->foreignId('fiscal_year_id')->constrained()->cascadeOnDelete();
            $table->integer('month'); // 1-12
            $table->decimal('receipt_amount', 15, 2)->default(0); // Penerimaan dari Yayasan
            $table->decimal('exp_personnel', 15, 2)->default(0); // Pengeluaran: Pers
            $table->decimal('exp_goods', 15, 2)->default(0); // Pengeluaran: Barang
            $table->decimal('exp_maintenance', 15, 2)->default(0); // Pengeluaran: Har
            $table->decimal('exp_travel', 15, 2)->default(0); // Pengeluaran: Jaldis
            $table->decimal('exp_general', 15, 2)->default(0); // Pengeluaran: Umum
            $table->timestamps();

            $table->unique(['budget_item_id', 'fiscal_year_id', 'month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('monthly_data');
    }
};
