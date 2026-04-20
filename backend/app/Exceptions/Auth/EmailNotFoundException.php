<?php

namespace App\Exceptions\Auth;

use RuntimeException;

class EmailNotFoundException extends RuntimeException
{
    public function __construct(string $message = 'No account found for this email.')
    {
        parent::__construct($message);
    }
}