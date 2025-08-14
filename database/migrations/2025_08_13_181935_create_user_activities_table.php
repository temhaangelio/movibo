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
        Schema::create('user_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('action'); // login, logout, post_create, post_delete, etc.
            $table->string('description')->nullable(); // Açıklama
            $table->string('ip_address', 45)->nullable(); // IPv6 için 45 karakter
            $table->string('user_agent')->nullable(); // Tarayıcı bilgisi
            $table->string('url')->nullable(); // Hangi URL'de işlem yapıldı
            $table->json('metadata')->nullable(); // Ek bilgiler (JSON)
            $table->timestamps();
            
            // İndeksler
            $table->index(['user_id', 'created_at']);
            $table->index(['action', 'created_at']);
            $table->index('ip_address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_activities');
    }
};
