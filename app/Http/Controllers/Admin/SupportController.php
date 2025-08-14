<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupportController extends Controller
{
    /**
     * Display a listing of support tickets.
     */
    public function index()
    {
        $tickets = SupportTicket::with('user')
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Destek/Index', [
            'tickets' => $tickets,
        ]);
    }

    /**
     * Display the specified support ticket.
     */
    public function show(SupportTicket $ticket)
    {
        $ticket->load('user');

        return Inertia::render('Admin/Destek/Show', [
            'ticket' => $ticket,
        ]);
    }

    /**
     * Update the specified support ticket.
     */
    public function update(Request $request, SupportTicket $ticket)
    {
        $validated = $request->validate([
            'admin_reply' => 'required|string|max:2000',
            'status' => 'required|in:open,pending,closed',
        ]);

        $ticket->update([
            'admin_reply' => $validated['admin_reply'],
            'status' => $validated['status'],
            'replied_at' => now(),
        ]);

        // Kullanıcıya bildirim gönder
        Notification::create([
            'user_id' => $ticket->user_id,
            'from_user_id' => auth()->id(),
            'type' => 'support',
            'content' => 'Destek isteğinize yanıt verildi: ' . $ticket->subject,
            'data' => [
                'ticket_id' => $ticket->id,
                'subject' => $ticket->subject,
                'status' => $validated['status'],
            ],
            'is_read' => false,
        ]);

        return redirect()->back()->with('success', 'Destek isteği başarıyla güncellendi!');
    }

    /**
     * Remove the specified support ticket.
     */
    public function destroy(SupportTicket $ticket)
    {
        $ticket->delete();

        return redirect()->route('admin.support.index')->with('success', 'Destek isteği başarıyla silindi!');
    }
}
