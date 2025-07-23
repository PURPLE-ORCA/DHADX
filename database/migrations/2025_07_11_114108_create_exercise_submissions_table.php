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
        Schema::create('exercise_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seance_exercise_id')->constrained('seance_exercises')->onDelete('cascade');
            $table->foreignId('collaborator_id')->constrained('collaborators')->onDelete('cascade');
            $table->enum('submission_type', ['text', 'file', 'url', 'code'])->default('text');
            $table->longText('content'); // Can be text, a file path, a URL, or code snippet
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exercise_submissions');
    }
};
