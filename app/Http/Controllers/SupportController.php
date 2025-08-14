<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\SupportTicket;
use Inertia\Inertia;

class SupportController extends Controller
{
    /**
     * Display the support page.
     */
    public function index()
    {
        return Inertia::render('user/Destek');
    }

    /**
     * Get user's support tickets.
     */
    public function getUserTickets()
    {
        $tickets = SupportTicket::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'tickets' => $tickets,
        ]);
    }

    /**
     * Store a newly created support ticket.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        $ticket = SupportTicket::create([
            'user_id' => auth()->id(),
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status' => 'open',
        ]);

        // Admin'e email gönder (opsiyonel)
        // Mail::to('admin@example.com')->send(new SupportTicketNotification($ticket));

        return response()->json([
            'success' => true,
            'message' => 'Destek isteğiniz başarıyla gönderildi.',
            'ticket' => $ticket,
        ]);
    }
}
