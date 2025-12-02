<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin
        $admin = User::create([
            'name' => 'Administrator',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'phone' => '081234567890',
        ]);
        $admin->assignRole('admin');

        // Create Manager
        $manager = User::create([
            'name' => 'Manager Toko',
            'email' => 'manager@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'phone' => '081234567891',
        ]);
        $manager->assignRole('manager');

        // Create Staff
        $staff = User::create([
            'name' => 'Staff Gudang',
            'email' => 'staff@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'phone' => '081234567892',
        ]);
        $staff->assignRole('staff');

        // Create Demo Customer
        $customer = User::create([
            'name' => 'Budi Santoso',
            'email' => 'customer@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'phone' => '081234567893',
        ]);
        $customer->assignRole('customer');

        // Create address for customer
        Address::create([
            'user_id' => $customer->id,
            'label' => 'Rumah',
            'recipient_name' => 'Budi Santoso',
            'phone' => '081234567893',
            'address' => 'Jl. Sudirman No. 123',
            'city' => 'Jakarta Selatan',
            'province' => 'DKI Jakarta',
            'postal_code' => '12190',
            'district' => 'Setiabudi',
            'is_default' => true,
        ]);

        // Create additional test customers
        User::factory()
            ->count(10)
            ->create()
            ->each(function (User $user) {
                $user->assignRole('customer');
                Address::factory()->default()->create(['user_id' => $user->id]);
            });
    }
}
