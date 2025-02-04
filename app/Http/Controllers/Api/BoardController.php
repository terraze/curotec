<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Board;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BoardController extends Controller
{
    /**
     * List all boards
     */
    public function index(): JsonResponse
    {
        $boards = Board::with('creator:id,name')->get()
            ->map(function ($board) {
                $board->created_by = $board->creator->name;
                unset($board->creator);
                return $board;
            });

        return response()->json([
            'status' => 'success',
            'data' => $boards,
        ]);
    }

    /**
     * Get a specific board by ID
     */
    public function show(int $id): JsonResponse
    {
        try {
            $board = Board::with(['taskStatus', 'tasks', 'creator:id,name'])->findOrFail($id);
            $board->created_by = $board->creator->name;
            unset($board->creator);
            
            return response()->json([
                'status' => 'success',
                'data' => $board,
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Board not found',
            ], Response::HTTP_NOT_FOUND);
        }
    }

    /**
     * Create a new board
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $board = Board::create([
            ...$validated,
            'created_by' => 1, // TODO Hardcoding user ID as 1 for now
            'created_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Board created successfully',
            'data' => $board,
        ], Response::HTTP_CREATED);
    }

    /**
     * Delete a specific board
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $board = Board::findOrFail($id);
            $board->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Board deleted successfully',
            ], Response::HTTP_NO_CONTENT);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Board not found',
            ], Response::HTTP_NOT_FOUND);
        }
    }

    /**
     * Delete all boards
     */
    public function destroyAll(): JsonResponse
    {
        Board::truncate();

        return response()->json([
            'status' => 'success',
            'message' => 'All boards have been deleted',
        ], Response::HTTP_NO_CONTENT);
    }
}
