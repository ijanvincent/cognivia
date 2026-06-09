<?php

namespace App\Repositories\Auth;

use App\Models\User;
use App\Services\JwtService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthRepository
{
    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function findById(int $id): ?User
    {
        return User::find($id);
    }

    public function findByUsername(string $username): ?User
    {
        return User::where('username', $username)->first();
    }

    public function createUser(array $data): User
    {
        $user = User::create([
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => $data['password'],
        ]);
        $user->role = 'user';
        $user->save();

        return $user;
    }

    public function findAdminByEmail(string $email): ?User
    {
        return User::where('email', $email)
            ->where('role', 'admin')
            ->first();
    }

    public function findResetToken(string $email): ?object
    {
        return DB::table('password_reset_tokens')
            ->where('email', $email)
            ->first();
    }

    public function storeResetToken(string $email, string $token): void
    {
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            [
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );
    }

    public function deleteResetToken(string $email): void
    {
        DB::table('password_reset_tokens')
            ->where('email', $email)
            ->delete();
    }

    public function updateUser(int $id, array $data): User
    {
        $user = $this->findById($id);
        $user->update($data);

        return $user->fresh();
    }

    public function revokeTokensByPlatform(User $user, string $platform): void
    {
        $user->tokens()
            ->where('platform', $platform)
            ->delete();
    }

    public function createPlatformToken(
        User $user,
        string $tokenName,
        string $platform,
        ?\DateTimeInterface $expiresAt = null
    ): string {
        $expiresAt = $expiresAt ?? now()->addHours(24);

        $sanctumToken = $user->createToken($tokenName, ['*'], $expiresAt);
        $sanctumToken->accessToken->forceFill(['platform' => $platform])->save();

        return app(JwtService::class)->sign(
            tokenId: $sanctumToken->accessToken->id,
            userId: $user->id,
            platform: $platform,
            expiresAt: $expiresAt,
        );
    }
}
