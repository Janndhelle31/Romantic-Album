<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;

class TrackReferral
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only track if there's a referral code in the URL
        if ($request->has('ref')) {
            $referralCode = $request->query('ref');
            
            // Store in session for 30 days
            $request->session()->put('referral_code', $referralCode);
            $request->session()->put('referral_expires', now()->addDays(30)->timestamp);
            
            // Check if referrer exists
            $referrer = User::where('referral_code', $referralCode)->first();
            
            if ($referrer) {
                // Store referrer info for later use
                $request->session()->put('referrer_id', $referrer->id);
                $request->session()->put('referrer_name', $referrer->name);
            }
        }
        
        // Check if referral session is expired
        if ($request->session()->has('referral_expires')) {
            $expires = $request->session()->get('referral_expires');
            
            if (now()->timestamp > $expires) {
                $request->session()->forget([
                    'referral_code',
                    'referral_expires',
                    'referrer_id',
                    'referrer_name'
                ]);
            }
        }

        return $next($request);
    }
}