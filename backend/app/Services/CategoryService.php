<?php

namespace App\Services;

use App\Repositories\CategoryRepository;

class CategoryService
{
    public function __construct(
        protected CategoryRepository $categoryRepository
    ) {}

    public function getAll()
    {
        return $this->categoryRepository->getAll();
    }

    public function create(array $data)
    {
        return $this->categoryRepository->create($data);
    }
}