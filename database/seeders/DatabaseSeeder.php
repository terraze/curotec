<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UsersSeeder::class,
            TaskStatusSeeder::class,
            BoardSeeder::class,
            BoardTaskStatusSeeder::class,
            TaskSeeder::class,
            RoleAndPermissionSeeder::class,
        ]);
    }
}
