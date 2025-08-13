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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title'); // Film/kitap başlığı
            $table->text('content'); // Kullanıcının yorumu
            $table->string('media_type'); // 'movie' veya 'book'
            $table->string('media_id'); // TheMovieDB veya Google Books ID
            $table->string('media_title'); // Film/kitap adı
            $table->text('media_description')->nullable(); // Açıklama
            $table->string('media_poster')->nullable(); // Kapak/afiş URL'i
            $table->string('media_release_date')->nullable(); // Yayın tarihi
            $table->string('media_rating')->nullable(); // Puan
            $table->string('media_genre')->nullable(); // Tür
            $table->string('media_author')->nullable(); // Yazar (kitap için)
            $table->string('media_director')->nullable(); // Yönetmen (film için)
            $table->integer('likes_count')->default(0);
            $table->integer('comments_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
