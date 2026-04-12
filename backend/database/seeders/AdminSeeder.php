<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $email    = env('ADMIN_SEEDER_EMAIL');
        $password = env('ADMIN_SEEDER_PASSWORD');

        if (!$email || !$password) {
            $this->command->error(
                'ADMIN_SEEDER_EMAIL or ADMIN_SEEDER_PASSWORD not set in .env — aborting.'
            );
            return;
        }

        User::updateOrCreate(
            ['email' => $email],
            [
                'username' => 'admin',
                'email'    => $email,
                'password' => Hash::make($password),
                'role'     => 'admin',
            ]
        );

        $this->command->info('Admin account ready.');
    }
}