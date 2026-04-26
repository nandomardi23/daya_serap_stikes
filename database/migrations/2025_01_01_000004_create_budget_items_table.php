<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('budget_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('budget_category_id')->constrained()->cascadeOnDelete();
            $table->string('account_code')->nullable(); // e.g., "04.00.00.02.01.010"
            $table->string('description'); // e.g., "Gaji Personel (Dosen & Tenaga Pendidikan)"
            $table->decimal('allocation', 15, 2)->default(0); // Budget allocation
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('budget_items');
    }
};
