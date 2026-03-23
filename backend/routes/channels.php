<?php

use Illuminate\Support\Facades\Broadcast;

// Existing — unchanged
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// NEW — Private channel for ForceLogout event
// Only the authenticated user can subscribe to their own channel
Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});