<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => [
                'required',
                'string',
                'min:3',
                'max:20',
                'unique:users,username',
                'regex:/^[a-zA-Z0-9_]+$/'
            ],
            'email' => [
                'required',
                'string',
                'email',
                'unique:users,email'
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed'
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'username.required'  => 'Username is required',
            'username.min'       => 'Username must be at least 3 characters',
            'username.max'       => 'Username must not exceed 20 characters',
            'username.unique'    => 'Username is already taken',
            'username.regex'     => 'Username can only contain letters, numbers and underscores',
            'email.required'     => 'Email is required',
            'email.email'        => 'Please enter a valid email address',
            'email.unique'       => 'This email is already registered',
            'password.required'  => 'Password is required',
            'password.min'       => 'Password must be at least 8 characters',
            'password.confirmed' => 'Passwords do not match',
        ];
    }
}