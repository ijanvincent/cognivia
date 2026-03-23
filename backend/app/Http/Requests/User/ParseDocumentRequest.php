<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class ParseDocumentRequest extends FormRequest
{
  
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'mimes:pdf,docx,pptx',
                'max:10240',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Please upload a document.',
            'file.file'     => 'The upload must be a valid file.',
            'file.mimes'    => 'Only PDF, DOCX, and PPTX files are supported.',
            'file.max'      => 'The document must not exceed 10MB.',
        ];
    }
}