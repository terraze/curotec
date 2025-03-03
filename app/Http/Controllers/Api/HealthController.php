<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class HealthController extends Controller
{
    public function check(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => 'API is running normally',
            'server_time' => now()->toIso8601String(),
        ], Response::HTTP_OK);
    }
}
