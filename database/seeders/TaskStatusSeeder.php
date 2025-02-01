<?php

namespace Database\Seeders;

use App\Models\TaskStatus;
use Illuminate\Database\Seeder;

class TaskStatusSeeder extends Seeder
{
    public function run(): void
    {
        TaskStatus::create(['name' => 'Open']);
        TaskStatus::create(['name' => 'In Progress']);
        TaskStatus::create(['name' => 'Closed']);
    }
} 