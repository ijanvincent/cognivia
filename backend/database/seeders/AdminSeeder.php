<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = config('seeder.admin_email');
        $password = config('seeder.admin_password');

        if (! $email || ! $password) {
            $this->command->error(
                'ADMIN_SEEDER_EMAIL or ADMIN_SEEDER_PASSWORD not set in .env — aborting.'
            );

            return;
        }

        $admin = User::updateOrCreate(
            ['email' => $email],
            [
                'username' => 'admin',
                'email' => $email,
                'password' => Hash::make($password),
            ]
        );
        $admin->role = 'admin';
        $admin->save();

        $this->command->info('Admin account ready.');
    }
}
