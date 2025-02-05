<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public int $taskId, public int $boardId)
    {
    }

    public function broadcastOn(): array
    {
        return [new Channel('board.' . $this->boardId)];
    }

    public function broadcastAs(): string
    {
        return 'task.deleted';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->taskId
        ];
    }
} 