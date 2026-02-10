<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        // Check if user is admin (role_as == 1)
        if (auth()->user()->role_as != 1) {
            // Redirect to USER dashboard (NOT admin dashboard)
            return redirect('/dashboard')  // ← Use URL instead of named route
                ->with('error', 'You do not have permission to access the admin panel.');
        }

        return $next($request);
    }
}