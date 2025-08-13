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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Bildirimi alan kullanıcı
            $table->foreignId('from_user_id')->nullable()->constrained('users')->onDelete('cascade'); // Bildirimi gönderen kullanıcı
            $table->string('type'); // follow, like, comment, post
            $table->text('content'); // Bildirim içeriği
            $table->json('data')->nullable(); // Ek veriler (post_id, comment_id vb.)
            $table->boolean('is_read')->default(false); // Okunma durumu
            $table->timestamps();
            
            // İndeksler
            $table->index(['user_id', 'is_read']);
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
