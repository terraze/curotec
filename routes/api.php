<?php

use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\Api\HealthController;
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
