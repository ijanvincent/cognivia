<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\QuizSession;
use App\Models\QuizAnswer;
use App\Models\Leaderboard;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    public function getQuestions(Request $request)
    {
        $questions = Question::with('choices')
            ->when($request->category_id, function ($query) use ($request) {
                $query->where('category_id', $request->category_id);
            })
            ->inRandomOrder()
            ->limit(10)
            ->get();

        return response()->json($questions);
    }

    public function startQuiz(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
        ]);

        $session = QuizSession::create([
            'user_id' => $request->user()->id,
            'category_id' => $request->category_id,
            'total_questions' => 10,
        ]);

        return response()->json($session, 201);
    }

    public function submitAnswer(Request $request)
    {
        $request->validate([
            'quiz_session_id' => 'required|exists:quiz_sessions,id',
            'question_id' => 'required|exists:questions,id',
            'choice_id' => 'required|exists:choices,id',
        ]);

        $choice = \App\Models\Choice::find($request->choice_id);
        $isCorrect = $choice->is_correct;

        $answer = QuizAnswer::create([
            'quiz_session_id' => $request->quiz_session_id,
            'question_id' => $request->question_id,
            'choice_id' => $request->choice_id,
            'is_correct' => $isCorrect,
        ]);

        if ($isCorrect) {
            $session = QuizSession::find($request->quiz_session_id);
            $question = Question::find($request->question_id);
            $session->increment('score', $question->points);
            $session->increment('correct_answers');
        }

        return response()->json([
            'is_correct' => $isCorrect,
            'answer' => $answer,
        ]);
    }

    public function leaderboard()
    {
        $leaderboard = Leaderboard::with('user')
            ->orderBy('total_score', 'desc')
            ->limit(10)
            ->get();

        return response()->json($leaderboard);
    }
}