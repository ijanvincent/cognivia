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
            // CHANGE 1 — regex: /^[a-zA-Z0-9_]+$/ → /^[a-zA-Z0-9_ ]+$/
            // What:  Added a space character to the allowed character class.
            // Why:   The field is labelled "Profile Name" on both web and mobile.
            //        A display name naturally contains spaces (e.g. "Emil Dacoylo").
            //        All three layers (web, mobile, backend) must enforce the same
            //        rule. Without this, submissions with spaces pass frontend
            //        validation but are rejected here with a 422.
            // Security: Regex remains a strict whitelist. Leading/trailing spaces
            //        are stripped by frontend .trim() before submission, so stored
            //        values will never carry surrounding whitespace.
            //
            // CHANGE 2 — max:20 → max:255
            // What:  Raised the ceiling to the standard Laravel string column max.
            // Why:   Real display names with spaces can easily approach 20 chars
            //        (e.g. "Christopher Dacoylo" = 19). max:20 is a silent UX trap
            //        now that spaces are permitted. 255 aligns with the DB column
            //        default and the recommended file.
            'username' => [
                'required',
                'string',
                'min:3',
                'max:255',
                'unique:users,username',
                'regex:/^[a-zA-Z0-9_ ]+$/',
            ],

            // CHANGE 4 — Added 'max:255' to email rules.
            // What:  Added a missing length guard.
            // Why:   Defense in depth — prevents oversized strings from reaching
            //        the database layer. Present in the recommended file, absent
            //        from the current file.
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email',
            ],

            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            // CHANGE 3 — All username.* messages updated to "Profile name" copy.
            // What:  String copy only — no logic change.
            // Why:   The frontend labels this field "Profile Name". Returning
            //        "Username is already taken" from the server while the UI
            //        says "Profile Name" breaks consistency and confuses users.
            'username.required' => 'Profile name is required.',
            'username.min'      => 'Profile name must be at least 3 characters.',
            'username.max'      => 'Profile name must not exceed 255 characters.',
            'username.unique'   => 'This profile name is already taken. Please choose another.',
            'username.regex'    => 'Profile name can only contain letters, numbers, underscores, and spaces.',

            'email.required'    => 'Email address is required.',
            'email.email'       => 'Please enter a valid email address.',
            'email.unique'      => 'This email is already registered. Please use a different email.',

            'password.required'  => 'Password is required.',
            'password.min'       => 'Password must be at least 8 characters.',
            'password.confirmed' => 'Passwords do not match.',
        ];
    }
}