<?php

namespace App\Events;

use App\Models\Task;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Task $task)
    {
    }

    public function broadcastOn(): array
    {
        return [new Channel('board.' . $this->task->board_id)];
    }

    public function broadcastAs(): string
    {
        return 'task.created';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->task->id,
            'title' => $this->task->title,
            'description' => $this->task->description,
            'task_status_id' => $this->task->task_status_id,
            'assignee_id' => $this->task->assignee_id,
            'board_id' => $this->task->board_id,
            'created_by' => $this->task->created_by,
            'created_at' => $this->task->created_at,
            'updated_at' => $this->task->updated_at,
        ];
    }
} 