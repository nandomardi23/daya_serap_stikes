<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('signatories', function (Blueprint $table) {
            $table->id();
            $table->string('position'); // waket_2, ka_biro_keuangan, ketua
            $table->string('position_label'); // "Waket II", "Ka Biro Keuangan", "Ketua"
            $table->string('name');
            $table->string('title')->nullable(); // Academic title
            $table->string('rank')->nullable(); // e.g., "Kolonel Laut (K/IV) Purn"
            $table->string('nik')->nullable();
            $table->string('institution')->nullable(); // e.g., "STIKES Hang Tuah Tanjungpinang"
            $table->string('location')->nullable(); // e.g., "Tanjungpinang"
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('signatories');
    }
};
