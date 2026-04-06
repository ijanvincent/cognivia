<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {

    private const ALLOWED_TYPES = [
        'identification',
        'multiple_choice',
        'explanatory',
        'true_false',
        'mixed',
    ];

    public function up(): void
    {
        Schema::table('flashcards', function (Blueprint $table) {
            $table->string('type', 30)
                  ->default('identification')
                  ->after('answer');

            $table->json('options')
                  ->nullable()
                  ->after('type')
                  ->comment('Stores A/B/C/D options for multiple_choice cards');

            $table->text('explanation')
                  ->nullable()
                  ->after('options')
                  ->comment('Stores correct-answer explanation for multiple_choice cards');
        });

        $allowed = implode("','", self::ALLOWED_TYPES);
        DB::statement("ALTER TABLE flashcards ADD CONSTRAINT chk_flashcard_type CHECK (type IN ('{$allowed}'))");
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE flashcards DROP CONSTRAINT IF EXISTS chk_flashcard_type');

        Schema::table('flashcards', function (Blueprint $table) {
            $table->dropColumn(['type', 'options', 'explanation']);
        });
    }
};