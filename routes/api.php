<?php

use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

// Health check endpoint
Route::get('/health', [HealthController::class, 'check']);

// Public endpoints
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// All API routes require authentication
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    
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

    // Users API
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/{user}', [UserController::class, 'show']);
    });

    Route::post('/users/{user}/assign-admin', [AuthController::class, 'assignAdminRole']);
    Route::post('/users/{user}/remove-admin', [AuthController::class, 'removeAdminRole']);
});
