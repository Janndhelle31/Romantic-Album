<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <!-- ADD THIS - Forces HTTPS for all requests -->
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
        
        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        
        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        
        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
        
        <!-- Force HTTPS for all JavaScript -->
        <script>
            if (window.location.protocol === 'https:') {
                // Force axios to use HTTPS
                if (window.axios) {
                    window.axios.defaults.baseURL = window.location.origin;
                }
                
                // Force all fetch requests to use HTTPS
                const originalFetch = window.fetch;
                window.fetch = function(url, options) {
                    if (typeof url === 'string' && url.startsWith('http://')) {
                        url = url.replace('http://', 'https://');
                    }
                    return originalFetch(url, options);
                };
            }
        </script>
    </body>
</html>