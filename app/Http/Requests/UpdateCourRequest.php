<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCourRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', Rule::unique('cours', 'name')->ignore($this->id)],
            'label' => ['required', Rule::unique('cours', 'label')->ignore($this->id)],
            'color' => ['required', Rule::unique('cours', 'color')->ignore($this->id)],
        ];

        // return [];
    }
}
