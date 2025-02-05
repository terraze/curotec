<?php

namespace App\Models;

use App\Events\TaskUpdated;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    use HasFactory, InteractsWithSockets;

    public $timestamps = true;

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

    protected $dispatchesEvents = [
        'updated' => TaskUpdated::class,
    ];

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

    /**
     * Get the channels that model events should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [new Channel('board.' . $this->board_id)];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'task.updated';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'updated_at' => $this->updated_at,
        ];
    }
} 