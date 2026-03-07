<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@cognivia.com'],
            [
                'username' => 'admin',
                'email'    => 'admin@cognivia.com',
                'password' => Hash::make('admin123456'),
                'role'     => 'admin',
            ]
        );

        $this->command->info('Admin account created successfully!');
        $this->command->info('Email: admin@cognivia.com');
        $this->command->info('Password: admin123456');
    }
}