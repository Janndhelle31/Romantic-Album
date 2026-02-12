<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Referral;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(Request $request): Response
    {
        $referralCode = $request->query('ref');
        $error = null;
        
        if ($referralCode) {
            $referrer = User::where('referral_code', $referralCode)->first();
            
            if (!$referrer) {
                $error = 'Invalid referral code.';
            }
        }

        return Inertia::render('Auth/Register', [
            'referral_code' => $referralCode,
            'error' => $error
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'referral_code' => 'nullable|string|exists:users,referral_code',
        ]);

        // Find referrer if code provided
        $referrer = null;
        if ($request->referral_code) {
            $referrer = User::where('referral_code', $request->referral_code)->first();
            
            if (!$referrer) {
                return back()->withErrors([
                    'referral_code' => 'Invalid referral code.'
                ]);
            }
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'referred_by' => $referrer ? $referrer->id : null,
            'is_paid' => 1, // ✅ SET PAID STATUS TO 1 ON REGISTRATION
        ]);

        // Create referral record if referrer exists
        if ($referrer) {
            Referral::create([
                'referrer_id' => $referrer->id,
                'referred_id' => $user->id,
                'discount_amount' => 50.00,
                'discount_applied' => false,
                'referrer_paid' => false,
            ]);
            
            // Update referrer's referral count
            $referrer->increment('referral_count');
        }

        event(new Registered($user));
        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}