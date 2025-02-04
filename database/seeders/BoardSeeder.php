<?php

namespace Database\Seeders;

use App\Models\Board;
use App\Models\User;
use Illuminate\Database\Seeder;

class BoardSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all()->random(2);

        Board::create([
            'name' => 'Board 1',
            'description' => 'First board, created by '.$users[0]->name,
            'created_by' => $users[0]->id,
        ]);

        Board::create([
            'name' => 'Board 2',
            'description' => 'Second board, created by '.$users[1]->name,
            'created_by' => $users[1]->id,
        ]);
    }
}
