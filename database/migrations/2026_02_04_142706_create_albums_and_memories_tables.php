<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
Schema::create('albums', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('slug')->unique();
    $table->string('title');
    $table->string('icon')->default('💖'); // Added for your 🌱, 🍕 icons
    $table->text('description')->nullable(); // Added for your category descriptions
    $table->string('theme_color')->default('#FFFBF0');
    $table->timestamps();
});
Schema::create('memories', function (Blueprint $table) {
    $table->id();
    $table->foreignId('album_id')->constrained()->onDelete('cascade');
    $table->string('image_path');
    $table->string('date_text');
    $table->text('note')->nullable();
    $table->integer('rotation')->default(0); // <--- ADD THIS LINE
    $table->timestamps();
});
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('albums_and_memories_tables');
    }
};
