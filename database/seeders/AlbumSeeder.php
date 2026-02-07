<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Album;
use App\Models\Memory;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AlbumSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create a Default User
        $user = User::firstOrCreate(
            ['email' => 'love@example.com'],
            ['name' => 'Admin', 'password' => Hash::make('password')]
        );

        // 2. Define Categories
        $categories = [
            ['id' => 'firsts', 'title' => 'The Beginning', 'icon' => '🌱', 'description' => 'Where our story started.'],
            ['id' => 'dates', 'title' => 'Our Dates', 'icon' => '🍕', 'description' => 'Every second with you is a gift.'],
            ['id' => 'travel', 'title' => 'Adventures', 'icon' => '✈️', 'description' => 'To the edge of the world and back.'],
            ['id' => 'silly', 'title' => 'Silly Moments', 'icon' => '🤪', 'description' => 'The laughs that keep me going.'],
            ['id' => 'golden', 'title' => 'Golden Hour', 'icon' => '✨', 'description' => 'Chasing sunsets with you.'],
            ['id' => 'comfort', 'title' => 'The Little Things', 'icon' => '☕', 'description' => 'Small moments, big memories.'],
            ['id' => 'food', 'title' => 'Kitchen Chaos', 'icon' => '🍳', 'description' => 'Our attempts at master chef.'],
            ['id' => 'soundtrack', 'title' => 'Our Soundtrack', 'icon' => '🎧', 'description' => 'The songs that sound like us.'],
            ['id' => 'holidays', 'title' => 'Festivities', 'icon' => '🎄', 'description' => 'Celebrating life together.'],
            ['id' => 'late-night', 'title' => 'Night Owls', 'icon' => '🌙', 'description' => 'Deep talks and midnight snacks.'],
            ['id' => 'victories', 'title' => 'Little Victories', 'icon' => '🏆', 'description' => 'Supporting each other, always.'],
            ['id' => 'sanctuary', 'title' => 'Our Sanctuary', 'icon' => '🏠', 'description' => 'Everywhere is home with you.'],
        ];

        // 3. Define Memory Data
        $allMemories = [
            'firsts' => [
                ['img' => "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f", 'date' => "The Day We Met", 'note' => "The world got a little brighter."],
                ['img' => "https://images.unsplash.com/photo-1516589174184-c68526514460", 'date' => "First Coffee", 'note' => "I remember your smile."],
                ['img' => "https://images.unsplash.com/photo-1519741497674-611481863552", 'date' => "First 'I Love You'", 'note' => "My heart almost jumped out."],
                ['img' => "https://images.unsplash.com/photo-1518199266791-5375a83190b7", 'date' => "Making it Official", 'note' => "The day I called you mine."],
                ['img' => "https://images.unsplash.com/photo-1494790108377-be9c29b29330", 'date' => "First Photo", 'note' => "We were so nervous."],
            ],
            'dates' => [
                ['img' => "https://images.unsplash.com/photo-1517048676732-d65bc937f952", 'date' => "Pizza & Rain", 'note' => "Best pizza ever because you were there."],
                ['img' => "https://images.unsplash.com/photo-1520174691701-bc555a3404ca", 'date' => "Rooftop Stars", 'note' => "Looking for constellations in your eyes."],
            ],
            // Add other categories here if you want more data!
        ];

        // 4. Execution Loop
        foreach ($categories as $cat) {
            $album = Album::create([
                'user_id'     => $user->id,
                'slug'        => $cat['id'],
                'title'       => $cat['title'],
                'icon'        => $cat['icon'],
                'description' => $cat['description'],
                'theme_color' => '#FFFBF0',
            ]);

            if (isset($allMemories[$cat['id']])) {
                foreach ($allMemories[$cat['id']] as $m) {
                    Memory::create([
                        'album_id'   => $album->id,
                        'image_path' => $m['img'],
                        'date_text'  => $m['date'], // Mapped to migration column
                        'note'       => $m['note'], // Mapped to migration column
                        'rotation'   => rand(-6, 6),
                    ]);
                }
            }
        }
    }
}