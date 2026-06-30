<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [    
            'username' => 'required|string|unique:users|max:255|regex:/^[A-Za-z0-9_.]+$/', 
            'email' => 'required|email|unique:users,email', 
            'password' => 'required|string|min:8'
        ];
    }
}
