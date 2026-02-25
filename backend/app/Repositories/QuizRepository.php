<?php

namespace App\Repositories;

use App\Models\Question;
use App\Models\QuizSession;
use App\Models\QuizAnswer;
use App\Models\Leaderboard;

class QuizRepository
{
    public function getQuestions(int $categoryId = null)
    {
        return Question::with('choices')
            ->when($categoryId, fn($q) => $q->where('category_id', $categoryId))
            ->inRandomOrder()
            ->limit(10)
            ->get();
    }

    public function createSession(array $data): QuizSession
    {
        return QuizSession::create($data);
    }

    public function findSession(int $id): ?QuizSession
    {
        return QuizSession::find($id);
    }

    public function createAnswer(array $data): QuizAnswer
    {
        return QuizAnswer::create($data);
    }

    public function getLeaderboard()
    {
        return Leaderboard::with('user')
            ->orderBy('total_score', 'desc')
            ->limit(10)
            ->get();
    }

    public function updateLeaderboard(int $userId, int $score): void
    {
        Leaderboard::updateOrCreate(
            ['user_id' => $userId],
            [
                'total_score' => \DB::raw('total_score + ' . $score),
                'quizzes_played' => \DB::raw('quizzes_played + 1'),
            ]
        );
    }
}