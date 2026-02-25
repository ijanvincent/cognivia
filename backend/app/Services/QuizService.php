<?php

namespace App\Services;

use App\Repositories\QuizRepository;
use App\Models\Choice;

class QuizService
{
    public function __construct(
        protected QuizRepository $quizRepository
    ) {}

    public function getQuestions(int $categoryId = null)
    {
        return $this->quizRepository->getQuestions($categoryId);
    }

    public function startQuiz(int $userId, int $categoryId)
    {
        return $this->quizRepository->createSession([
            'user_id' => $userId,
            'category_id' => $categoryId,
            'total_questions' => 10,
            'score' => 0,
            'correct_answers' => 0,
            'status' => 'in_progress',
        ]);
    }

    public function submitAnswer(array $data)
    {
        $choice = Choice::find($data['choice_id']);
        $isCorrect = $choice->is_correct;

        $answer = $this->quizRepository->createAnswer([
            'quiz_session_id' => $data['quiz_session_id'],
            'question_id' => $data['question_id'],
            'choice_id' => $data['choice_id'],
            'is_correct' => $isCorrect,
        ]);

        if ($isCorrect) {
            $session = $this->quizRepository->findSession($data['quiz_session_id']);
            $session->increment('score', 10);
            $session->increment('correct_answers');
            $this->quizRepository->updateLeaderboard($session->user_id, 10);
        }

        return ['is_correct' => $isCorrect, 'answer' => $answer];
    }

    public function getLeaderboard()
    {
        return $this->quizRepository->getLeaderboard();
    }
}