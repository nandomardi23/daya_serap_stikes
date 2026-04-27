<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Create permissions
        $permissions = [
            'manage-users',
            'manage-roles',
            'manage-permissions',
            'view-dashboard',
            'manage-fiscal-years',
            'manage-budget-categories',
            'manage-budget-items',
            'manage-monthly-data',
            'view-reports',
            'manage-signatories',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission);
        }

        // Create roles and assign permissions
        $adminRole = Role::findOrCreate('admin');
        $adminRole->givePermissionTo(Permission::all());

        $userRole = Role::findOrCreate('user');
        $userRole->givePermissionTo([
            'view-dashboard',
            'manage-monthly-data',
            'view-reports',
        ]);

        // Assign admin role to first user
        $user = User::first();
        if ($user) {
            $user->assignRole($adminRole);
            $user->update(['role' => 'admin']);
        }
    }
}
