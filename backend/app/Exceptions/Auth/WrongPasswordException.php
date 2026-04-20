<?php

namespace App\Exceptions\Auth;

use RuntimeException;


class WrongPasswordException extends RuntimeException
{
    public function __construct(string $message = 'Incorrect Password.')
    {
        parent::__construct($message);
    }
}