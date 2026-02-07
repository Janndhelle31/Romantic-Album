<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('letters', function (Blueprint $table) {
            $table->id();
            // Connects the letter to a specific user
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('recipient', 50);
            $table->text('message'); 
            $table->string('closing', 50);
            $table->string('sender', 50);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('letters');
    }
};
