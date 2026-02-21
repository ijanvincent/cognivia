<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('quiz_answers', function (Blueprint $table) {
        $table->id();
        $table->foreignId('quiz_session_id')->constrained()->onDelete('cascade');
        $table->foreignId('question_id')->constrained()->onDelete('cascade');
        $table->foreignId('choice_id')->constrained()->onDelete('cascade');
        $table->boolean('is_correct')->default(false);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_answers');
    }
};
