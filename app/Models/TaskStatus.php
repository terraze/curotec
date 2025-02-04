<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TaskStatus extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'sort_order',
    ];

    public function boards(): BelongsToMany
    {
        return $this->belongsToMany(Board::class, 'board_task_status')
            ->withPivot('sort_order')
            ->using(BoardTaskStatus::class);
    }
}
