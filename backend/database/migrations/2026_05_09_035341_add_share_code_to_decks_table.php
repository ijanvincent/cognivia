<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use App\Models\Deck;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('decks', function (Blueprint $table) {
            $table->string('share_code', 12)->nullable()->unique()->after('status');
        });

        // Backfill existing decks
        Deck::whereNull('share_code')->each(function ($deck) {
            $deck->update(['share_code' => 'FC-' . strtoupper(Str::random(8))]);
        });
    }

    public function down(): void
    {
        Schema::table('decks', function (Blueprint $table) {
            $table->dropColumn('share_code');
        });
    }
};