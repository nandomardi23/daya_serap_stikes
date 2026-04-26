<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('budget_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fiscal_year_id')->constrained()->cascadeOnDelete();
            $table->integer('roman_number'); // 1 = I, 2 = II, etc.
            $table->string('name'); // e.g., "BELANJA PERSONEL"
            $table->string('sub_label')->nullable(); // e.g., "ANGGARAN OPERASIONAL PENDIDIKAN"
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('budget_categories');
    }
};
