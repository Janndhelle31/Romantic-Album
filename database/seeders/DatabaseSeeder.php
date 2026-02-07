<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call your custom seeders here
        $this->call([
            UserSeeder::class,
            AlbumSeeder::class,
        ]);
    }
}