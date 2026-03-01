<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    private const SUPPORTED_LOCALES = ['id', 'en'];

    public function handle(Request $request, Closure $next): Response
    {
        // Session takes priority (set immediately on switch), cookie is fallback (persists across sessions)
        $locale = session('locale', $request->cookie('locale', config('app.locale', 'id')));

        if (! in_array($locale, self::SUPPORTED_LOCALES, true)) {
            $locale = config('app.locale', 'id');
        }

        App::setLocale($locale);

        return $next($request);
    }
}
