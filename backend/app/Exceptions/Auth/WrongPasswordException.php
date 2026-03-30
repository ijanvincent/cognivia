<?php

namespace App\Exceptions\Auth;

use RuntimeException;


class WrongPasswordException extends RuntimeException
{
    public function __construct(string $message = 'The password you entered is incorrect.')
    {
        parent::__construct($message);
    }
}