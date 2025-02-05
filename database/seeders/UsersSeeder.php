<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Standard User',
            'email' => 'standard@example.com',
            'password' => Hash::make('123456'),
        ]);

        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('123456'),
        ]);

        User::factory()->createMany([
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah.johnson@example.com',
            ],
            [
                'name' => 'Michael Chen',
                'email' => 'michael.chen@example.com',
            ],
            [
                'name' => 'Emily Rodriguez',
                'email' => 'emily.r@example.com',
            ],
            [
                'name' => 'David Smith',
                'email' => 'david.smith@example.com',
            ],
            [
                'name' => 'Lisa Williams',
                'email' => 'lisa.w@example.com',
            ],
        ]);
    }
}
