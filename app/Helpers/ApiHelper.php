<?php

namespace App\Helpers;

class ApiHelper
{
    public static function getTmdbApiKey()
    {
        return config('services.tmdb.api_key');
    }

    public static function getTmdbBaseUrl()
    {
        return 'https://api.themoviedb.org/3';
    }

    public static function getGoogleBooksBaseUrl()
    {
        return 'https://www.googleapis.com/books/v1';
    }
} 