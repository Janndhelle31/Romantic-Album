<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Your Account
        User::create([
            'name' => 'Demo User',
            'email' => 'demo@gmail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(), // Optional: Marks the user as verified immediately
        ]);

    }
}