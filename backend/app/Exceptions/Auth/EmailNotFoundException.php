<?php

namespace App\Exceptions\Auth;

use RuntimeException;

class EmailNotFoundException extends RuntimeException
{
    public function __construct(string $message = 'No account found with this email address.')
    {
        parent::__construct($message);
    }
}