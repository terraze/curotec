<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TaskController extends Controller
{
    /**
     * Get all tasks.
     */
    public function index(): JsonResponse
    {
        $tasks = Task::all();
        return response()->json([
            'status' => 'success',
            'data' => $tasks,
        ]);
    }

    /**
     * Get a specific task.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $task = Task::findOrFail($id);

            return response()->json([
                'status' => 'success',
                'data' => $task,
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Task not found',
            ], Response::HTTP_NOT_FOUND);
        }
    }

    /**
     * Create a new task.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'board_id' => 'required|exists:boards,id', 
            'task_status_id' => 'exists:task_statuses,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $task = Task::create([
            ...$validated,
            'created_by' => 1, // TODO Hardcoding user ID as 1 for now
            'created_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Task created successfully',
            'data' => $task,
        ], Response::HTTP_CREATED);
    }

    /**
     * Delete a specific task
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $task = Task::findOrFail($id);
            $task->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Task deleted successfully',
            ], Response::HTTP_NO_CONTENT);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Task not found',
            ], Response::HTTP_NOT_FOUND);
        }
    }

    /**
     * Delete all tasks
     */
    public function destroyAll(): JsonResponse
    {
        Task::truncate();

        return response()->json([
            'status' => 'success',
            'message' => 'All tasks have been deleted',
        ], Response::HTTP_NO_CONTENT);
    }
}