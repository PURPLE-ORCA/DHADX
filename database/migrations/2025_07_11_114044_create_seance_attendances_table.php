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
        Schema::create('seance_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seance_id')->constrained('seances')->onDelete('cascade');
            $table->foreignId('collaborator_id')->constrained('collaborators')->onDelete('cascade');
            $table->enum('status', ['present', 'absent', 'excused'])->default('absent');
            $table->timestamp('checked_in_at')->nullable();
            $table->timestamps();

            // Ensure a collaborator can only be marked once per seance
            $table->unique(['seance_id', 'collaborator_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seance_attendances');
    }
};
