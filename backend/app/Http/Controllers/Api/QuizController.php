<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuizSessionResource;
use App\Services\QuizService;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    public function __construct(
        protected QuizService $quizService
    ) {}

    public function getQuestions(Request $request)
    {
        $questions = $this->quizService->getQuestions(
            $request->category_id
        );

        return response()->json($questions);
    }

    public function startQuiz(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
        ]);

        $session = $this->quizService->startQuiz(
            $request->user()->id,
            $request->category_id
        );

        return new QuizSessionResource($session);
    }

    public function submitAnswer(Request $request)
    {
        $request->validate([
            'quiz_session_id' => 'required|exists:quiz_sessions,id',
            'question_id' => 'required|exists:questions,id',
            'choice_id' => 'required|exists:choices,id',
        ]);

        $result = $this->quizService->submitAnswer($request->all());

        return response()->json($result);
    }

    public function leaderboard()
    {
        return response()->json(
            $this->quizService->getLeaderboard()
        );
    }
}