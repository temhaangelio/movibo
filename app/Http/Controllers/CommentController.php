<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Http\Controllers\NotificationController;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Get comments for a specific post
     */
    public function getPostComments(Post $post)
    {
        $comments = $post->comments()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'comments' => $comments,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'post_id' => 'required|exists:posts,id',
            'content' => 'required|string|max:500',
        ]);

        $comment = auth()->user()->comments()->create($validated);
        
        // Post'un yorum sayısını güncelle
        $post = Post::find($validated['post_id']);
        $post->updateCommentsCount();

        // Bildirim oluştur (kendi paylaşımına yorum yapmazsa)
        if ($post->user_id !== auth()->user()->id) {
            NotificationController::createCommentNotification(
                auth()->user()->id, 
                $post->id, 
                $comment->id
            );
        }

        return response()->json([
            'comment' => $comment->load('user'),
            'comments_count' => $post->comments_count,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);

        $post = $comment->post;
        $comment->delete();
        
        // Post'un yorum sayısını güncelle
        $post->updateCommentsCount();

        return response()->json([
            'success' => true,
            'comments_count' => $post->comments_count,
        ]);
    }
}
