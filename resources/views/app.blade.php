<!-- resources/views/app.blade.php -->
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Barter - Trade items with people in your community">
        <meta name="keywords" content="barter, trade, exchange, community, marketplace">
        <meta property="og:title" content="Barter - Trade Items Locally">
        <meta property="og:description" content="Find and trade items with people in your community">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://your-domain.com">
        <meta property="og:image" content="https://your-domain.com/images/og-image.jpg">
        
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        @routes
        @vite('resources/js/app.js')
        @inertiaHead
        <title>Barter - Trade Items With Your Community</title>
    </head>
    <body class="bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300 antialiased">
    @inertia
    </body>
</html>