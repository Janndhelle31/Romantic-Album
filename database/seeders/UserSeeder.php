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
            'name' => 'Janndhelle',
            'email' => 'admin@love.com',
            'password' => Hash::make('password'), // Change this!
        ]);

        // Her Account
        User::create([
            'name' => 'Vetch',
            'email' => 'her@love.com',
            'password' => Hash::make('password'), // Change this!
        ]);
    }
}