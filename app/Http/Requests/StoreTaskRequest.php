<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::user()->hasRole('admin');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Rules for the Parent Task
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'priority' => ['required', 'in:low,medium,high'],

            // --- NEW RULES FOR SUB-TASKS ---
            // Ensure 'sub_tasks' is present and is an array
            'sub_tasks' => ['required', 'array', 'min:1'],

            // Rules for each item *within* the sub_tasks array
            'sub_tasks.*.title' => ['required', 'string', 'max:255'],
            'sub_tasks.*.description' => ['nullable', 'string'],
            'sub_tasks.*.assignee_id' => ['required', 'exists:users,id'],
        ];
    }
}
