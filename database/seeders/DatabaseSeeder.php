<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\FiscalYear;
use App\Models\BudgetCategory;
use App\Models\BudgetItem;
use App\Models\Signatory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin',
            'email' => 'admin@stikes.ac.id',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create fiscal year
        $fy = FiscalYear::create([
            'year' => '2025/2026',
            'label' => 'TA 2025/2026',
            'is_active' => true,
        ]);

        // Create budget categories
        $categories = [
            [1, 'BELANJA PERSONEL', 'ANGGARAN OPERASIONAL PENDIDIKAN'],
            [2, 'BELANJA BARANG', null],
            [3, 'BELANJA PEMELIHARAAN', null],
            [4, 'BELANJA JALDIS', null],
            [5, 'BELANJA UMUM', null],
            [6, 'BELANJA PERSONEL', null],
            [7, 'SARANA DAN PRASARANA', null],
        ];

        foreach ($categories as $i => [$roman, $name, $sub]) {
            BudgetCategory::create([
                'fiscal_year_id' => $fy->id,
                'roman_number' => $roman,
                'name' => $name,
                'sub_label' => $sub,
                'sort_order' => $i,
            ]);
        }

        // Add sample items to category I
        $cat1 = BudgetCategory::where('fiscal_year_id', $fy->id)->where('sort_order', 0)->first();
        $sampleItems = [
            ['04.00.00.02.01.010', 'Gaji Personel (Dosen & Tenaga Pendidikan)', 2458801404],
            ['04.00.00.02.01.010', 'Gaji Ke-13 (THP)', 181044470],
            ['04.00.00.02.01.010', 'Tunjangan Kehadiran/Kompensasi', 16800000],
            ['04.00.00.02.01.010', 'Tunjangan Kehormatan', 195425000],
            ['04.00.00.02.01.010', 'Tunjangan Komunikasi', 75900000],
            ['04.00.00.02.01.010', 'Pesangon / Pemisahan Personel', 174584470],
            ['04.00.00.02.01.010', 'Honor Lembur', 16770000],
            ['04.00.00.02.01.010', 'Honor Kelebihan Mengajar/Tutorial', 248943630],
        ];

        foreach ($sampleItems as $i => [$code, $desc, $alloc]) {
            BudgetItem::create([
                'budget_category_id' => $cat1->id,
                'account_code' => $code,
                'description' => $desc,
                'allocation' => $alloc,
                'sort_order' => $i,
            ]);
        }

        // Create signatories
        Signatory::create([
            'position' => 'waket_2',
            'position_label' => 'Waket II',
            'name' => 'Liza Vati',
            'title' => 'S.Kep, Ns., M.Kep',
            'nik' => '11061',
            'sort_order' => 1,
        ]);

        Signatory::create([
            'position' => 'ka_biro_keuangan',
            'position_label' => 'Ka Biro Keuangan',
            'name' => 'Vivit Hardiyanti, Amd',
            'nik' => '11007',
            'location' => 'Tanjungpinang',
            'sort_order' => 2,
        ]);

        Signatory::create([
            'position' => 'ketua',
            'position_label' => 'Ketua',
            'name' => 'Dra Mila Abdullah, MM',
            'rank' => 'Kolonel Laut (K/IV) Purn',
            'nik' => '12060',
            'institution' => 'STIKES Hang Tuah Tanjungpinang',
            'sort_order' => 3,
        ]);
    }
}
