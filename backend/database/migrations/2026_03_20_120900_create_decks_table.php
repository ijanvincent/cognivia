<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('decks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('source')->nullable();
            $table->integer('card_count')->default(0);
            $table->integer('mastery')->default(0);
            $table->integer('progress')->default(0);
            $table->string('status')->default('New');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('decks');
    }
};