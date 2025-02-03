<?php

use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Health check endpoint
Route::get('/health', [HealthController::class, 'check']);

// Boards API
Route::prefix('boards')->group(function () {
    Route::get('/', [BoardController::class, 'index']);
    Route::get('/{board}', [BoardController::class, 'show']);
    Route::post('/', [BoardController::class, 'store']);
    Route::delete('/{board}', [BoardController::class, 'destroy']);
    Route::delete('/', [BoardController::class, 'destroyAll']);
});

// Tasks API
Route::prefix('tasks')->group(function () {
    Route::get('/', [TaskController::class, 'index']);
    Route::get('/{task}', [TaskController::class, 'show']);
    Route::post('/', [TaskController::class, 'store']);
    Route::delete('/{task}', [TaskController::class, 'destroy']);
    Route::delete('/', [TaskController::class, 'destroyAll']);
    Route::put('/{task}/status', [TaskController::class, 'updateStatus']);
    Route::put('/{task}/assignee', [TaskController::class, 'updateAssignee']);
});

/*
TODO Implement on story-003

// Users API
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    // Your protected routes here
});
*/
