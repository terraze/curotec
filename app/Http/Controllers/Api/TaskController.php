<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\BoardTaskStatus;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Events\TaskUpdated;
use App\Events\TaskCreated;
use App\Events\TaskDeleted;


class TaskController extends Controller
{
    /**
     * Get all tasks.
     */
    public function index(): JsonResponse
    {
        $tasks = Task::with('creator:id,name')->get()
            ->map(function ($task) {
                $task->created_by = $task->creator->name;
                unset($task->creator);
                return $task;
            });

        return response()->json([
            'status' => 'success',
            'data' => $tasks,
        ], Response::HTTP_OK);
    }

    /**
     * Get a specific task.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $task = Task::with('creator:id,name')->findOrFail($id);
            $task->created_by = $task->creator->name;
            unset($task->creator);

            return response()->json([
                'status' => 'success',
                'data' => $task,
            ], Response::HTTP_OK);
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

        event(new TaskCreated($task));

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
            $boardId = $task->board_id;
            $taskId = $task->id;
            $task->delete();

            event(new TaskDeleted($taskId, $boardId));

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

    /**
     * Update task status
     */
    public function updateStatus(Request $request, Task $task): JsonResponse
    {
        try {
            $validated = $request->validate([
                'task_status_id' => 'required|integer|exists:task_statuses,id',
                'updated_at' => 'required|date'
            ]);

            // Check if the task has been modified since the client last saw it
            if ($task->updated_at->ne($validated['updated_at'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Task has been modified by another user',
                    'code' => 'STALE_OBJECT',
                    'data' => $task->fresh()
                ], Response::HTTP_CONFLICT);
            }

            // Check if this status is valid for this board
            BoardTaskStatus::where('task_status_id', $validated['task_status_id'])
                ->where('board_id', $task->board_id)
                ->firstOrFail();

            $task->update([
                'task_status_id' => $validated['task_status_id']
            ]);
            event(new TaskUpdated($task));

            return response()->json([
                'status' => 'success',
                'message' => 'Task status updated successfully',
                'data' => $task->fresh()
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid status for this board',
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Update task assignee
     */
    public function updateAssignee(Request $request, Task $task): JsonResponse
    {
        try {
            $validated = $request->validate([
                'assignee_id' => 'nullable|integer|exists:users,id',
            ]);

            $task->update([
                'assignee_id' => $validated['assignee_id'] ?? null
            ]);
            event(new TaskUpdated($task));

            return response()->json([
                'status' => 'success',
                'message' => 'Task assignee updated successfully',
                'data' => $task->fresh()->load('assignee')
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid user',
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $task->update($request->validated());
        
        return new TaskResource($task);
    }
}