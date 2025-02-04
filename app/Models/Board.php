<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Board extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'created_by',
    ];

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
