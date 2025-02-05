<?php

return [
    'supports_credentials' => true,
    'paths' => [
        'api/*',
        '/login',
        '/logout',
        '/sanctum/csrf-cookie'
    ],
]; 

