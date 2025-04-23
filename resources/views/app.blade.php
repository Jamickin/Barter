<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        @routes
        @vite('resources/js/app.js')
        @inertiaHead
        <title>Barter</title>
    </head>
    <body class="bg-slate-200 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300">
    @inertia
    </body>
</html>
