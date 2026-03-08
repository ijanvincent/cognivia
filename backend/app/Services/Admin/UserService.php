<?php

namespace App\Services\Admin;

use App\Repositories\Admin\UserRepository;

class UserService
{
    public function __construct(
        private UserRepository $userRepository
    ) {}

    public function getDashboardStats(): array
    {
        return [
            'total_users'      => $this->userRepository->getTotalUsers(),
            'new_today'        => $this->userRepository->getNewUsersToday(),
            'new_this_month'   => $this->userRepository->getNewUsersThisMonth(),
        ];
    }

    public function getAllUsers(): array
    {
        return $this->userRepository->getAllUsers()->toArray();
    }

    public function deleteUser(int $id): bool
    {
        return $this->userRepository->deleteUser($id);
    }
}