<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'board_id',
        'created_by',
        'task_status_id',
        'assignee_id'
    ];

    protected static function booted()
    {
        static::creating(function ($task) {
            if (!$task->task_status_id) {
                // Get the default status (sort_order = 1) for the board
                $defaultStatus = $task->board->taskStatuses()
                    ->wherePivot('sort_order', 1)
                    ->first();
                    
                if (!$defaultStatus) {
                    throw new \RuntimeException('No default status found for this board');
                }
                
                $task->task_status_id = $defaultStatus->id;
            }
        });
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(TaskStatus::class, 'task_status_id');
    }

    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
} 