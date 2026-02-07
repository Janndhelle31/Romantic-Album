<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        // Get your main user (adjust the email to yours)
        $user = User::where('email', 'love@example.com')->first();

        if ($user) {
            Setting::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'story_title' => 'Our Story',
                    'story_subtitle' => 'Every chapter with you is my favorite.',
                    'anniversary_date' => '2026-05-20',
                    'theme' => 'midnight',
                ]
            );
        }
    }
}