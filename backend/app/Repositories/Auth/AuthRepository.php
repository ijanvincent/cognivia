<?php

namespace App\Repositories\Auth;

use App\Models\User;
use App\Services\JwtService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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
        // Build and persist in a single INSERT. `role` is intentionally not in
        // $fillable (mass-assignment protection), so it is set explicitly on
        // the instance before the first save rather than via a second UPDATE
        // round-trip — one fewer remote DB query per registration.
        $user = new User;
        $user->username = $data['username'];
        $user->email = $data['email'];
        $user->password = $data['password'];
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

        // Persist the token row in a single INSERT with `platform` already set,
        // instead of Sanctum's createToken() (INSERT) followed by a separate
        // UPDATE to fill `platform` — one fewer remote-DB round-trip per login
        // and register. This mirrors createToken()'s own row shape: the
        // sha256(random) `token` value is required and unique but never returned
        // here, because clients authenticate with the JWT below (keyed by the
        // row id), not the raw Sanctum token.
        $token = $user->tokens()->create([
            'name' => $tokenName,
            'token' => hash('sha256', Str::random(40)),
            'abilities' => ['*'],
            'expires_at' => $expiresAt,
            'platform' => $platform,
        ]);

        return app(JwtService::class)->sign(
            tokenId: $token->id,
            userId: $user->id,
            platform: $platform,
            expiresAt: $expiresAt,
        );
    }
}
