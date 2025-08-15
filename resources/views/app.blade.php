<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=nunito:400,500,600,700&display=swap&subset=latin,latin-ext" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
        
        <!-- Force HTTPS for assets - temporarily disabled -->
        {{-- @if(config('app.env') === 'production')
        <script>
            // Force HTTPS for all assets
            document.addEventListener('DOMContentLoaded', function() {
                const links = document.querySelectorAll('link[rel="stylesheet"], script[src]');
                links.forEach(function(link) {
                    if (link.href && link.href.startsWith('http://')) {
                        link.href = link.href.replace('http://', 'https://');
                    }
                    if (link.src && link.src.startsWith('http://')) {
                        link.src = link.src.replace('http://', 'https://');
                    }
                });
            });
        </script>
        @endif --}}
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
