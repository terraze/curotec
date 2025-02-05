<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('tasks', function ($task) {
    return $task;
});
