<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'username'           => $this->username,
            'email'              => $this->email,
            'role'               => $this->role,
            'avatar'             => $this->avatar,
            'email_verified_at'  => $this->email_verified_at,
            'created_at'         => $this->created_at,
        ];
    }
}