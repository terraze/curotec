<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
            'task_status_id' => 'sometimes|exists:task_statuses,id',
            'assignee_id' => 'sometimes|nullable|exists:users,id',
        ];
    }
} 