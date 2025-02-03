<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class BoardTaskStatus extends Pivot
{
    protected $table = 'board_task_status';

    public $timestamps = false;

    protected $fillable = [
        'board_id',
        'task_status_id',
        'sort_order',
    ];
}
