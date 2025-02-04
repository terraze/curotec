<?php

namespace Database\Seeders;

use App\Models\Board;
use App\Models\Task;
use App\Models\TaskStatus;
use App\Models\User;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $boards = Board::all();
        
        foreach ($boards as $board) {            
            $statuses = TaskStatus::whereIn('id', $board->taskStatuses->pluck('id'))->get();
            
            // Create 5-10 tasks per board
            $tasksCount = rand(5, 10);
            for ($i = 0; $i < $tasksCount; $i++) {
                Task::create([
                    'title' => "Task ".($i+1),
                    'description' => fake()->paragraph(),
                    'board_id' => $board->id,
                    'task_status_id' => $statuses->random()->id,
                    'assignee_id' => $users->random()->id,
                    'created_by' => $users->random()->id,
                ]);
            }
        }
    }
} 