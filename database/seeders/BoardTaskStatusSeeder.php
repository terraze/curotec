<?php

namespace Database\Seeders;

use App\Models\Board;
use App\Models\TaskStatus;
use Illuminate\Database\Seeder;

class BoardTaskStatusSeeder extends Seeder
{
    public function run(): void
    {
        $boards = Board::all();
        $taskStatuses = TaskStatus::all();

        // Map status names to their expected sort order
        $sortOrders = [
            'Open' => 1,
            'In Progress' => 2,
            'Closed' => 3,
        ];

        foreach ($boards as $board) {
            foreach ($taskStatuses as $status) {
                $board->taskStatuses()->attach($status->id, [
                    'sort_order' => $sortOrders[$status->name],
                ]);
            }
        }
    }
}
