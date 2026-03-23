<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\ParseDocumentRequest;
use App\Services\User\DocumentParserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class DocumentParserController extends Controller
{
    public function __construct(
        private readonly DocumentParserService $documentParserService
    ) {}

    public function parse(ParseDocumentRequest $request): JsonResponse
    {
        try {
            $text = $this->documentParserService->parse($request->file('file'));

            return response()->json([
                'success' => true,
                'data'    => [
                    'text'      => $text,
                    'filename'  => $request->file('file')->getClientOriginalName(),
                    'extension' => strtolower($request->file('file')->getClientOriginalExtension()),
                ],
            ], 200);

        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);

        } catch (\RuntimeException $e) {
            Log::error('DocumentParserController error', [
                'error' => $e->getMessage(),
                'user'  => $request->user()?->id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to parse document. Please ensure the file is not corrupted.',
            ], 500);
        }
    }
}