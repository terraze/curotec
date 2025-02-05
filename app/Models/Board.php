<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\TaskStatus;
use App\Models\BoardTaskStatus;
use App\Models\Task;

class Board extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'created_by',
    ];

    protected static function booted()
    {
        static::created(function ($board) {
            // We don't have a system to manage task statuses, so we'll just get all task statuses ordered by id
            $taskStatuses = TaskStatus::orderBy('id')->get();

            // Create an array with task_status_id => sort_order pairs
            $taskStatusesWithOrder = $taskStatuses->mapWithKeys(function ($status, $index) {
                return [$status->id => ['sort_order' => $index + 1]];
            })->toArray();

            // Attach all task statuses to the new board with sort_order
            $board->taskStatuses()->attach($taskStatusesWithOrder);
        });
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function taskStatuses(): BelongsToMany
    {
        return $this->belongsToMany(TaskStatus::class, 'board_task_status')
            ->withPivot('sort_order')
            ->using(BoardTaskStatus::class);
    }

    public function taskStatus(): HasMany
    {
        return $this->hasMany(BoardTaskStatus::class)->with('taskStatus');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
