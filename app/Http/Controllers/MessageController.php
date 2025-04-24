<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    /**
     * Display a listing of the user's messages.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get received messages
        $receivedMessages = Message::with(['sender', 'listing'])
            ->where('to_user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();
            
        // Get sent messages
        $sentMessages = Message::with(['recipient', 'listing'])
            ->where('from_user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return inertia('Messages/Index', [
            'receivedMessages' => $receivedMessages,
            'sentMessages' => $sentMessages
        ]);
    }
    
    /**
     * Show the form for composing a new message.
     */
    public function create(Request $request)
    {
        $toUser = null;
        $listing = null;
        
        // If a user ID is provided, load that user's info
        if ($request->has('to')) {
            $toUser = User::findOrFail($request->input('to'));
        }
        
        // If a listing ID is provided, load that listing's info
        if ($request->has('listing')) {
            $listing = Listing::with('owner')->findOrFail($request->input('listing'));
            
            // If no recipient specified but listing has an owner, use the owner
            if (!$toUser && $listing->owner) {
                $toUser = $listing->owner;
            }
        }
        
        return inertia('Messages/Create', [
            'recipient' => $toUser,
            'listing' => $listing
        ]);
    }
    
    /**
     * Store a newly created message.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'to_user_id' => 'required|exists:users,id',
            'listing_id' => 'nullable|exists:listings,id',
            'message' => 'required|string|min:2'
        ]);
        
        // Create message
        $message = new Message();
        $message->from_user_id = Auth::id();
        $message->to_user_id = $validated['to_user_id'];
        $message->listing_id = $validated['listing_id'] ?? null;
        $message->message = $validated['message'];
        $message->save();
        
        return redirect()->route('messages.index')
            ->with('success', 'Message sent successfully!');
    }
    
    /**
     * Display the specified message.
     */
    public function show(Message $message)
    {
        // Check if user is allowed to view the message
        if (Auth::id() !== $message->from_user_id && Auth::id() !== $message->to_user_id) {
            abort(403, 'Unauthorized action.');
        }
        
        // If current user is the recipient and message is unread, mark as read
        if (Auth::id() === $message->to_user_id && !$message->read) {
            $message->read = true;
            $message->save();
        }
        
        // Load related data
        $message->load(['sender', 'recipient', 'listing']);
        
        return inertia('Messages/Show', [
            'message' => $message
        ]);
    }
    
    /**
     * Show the form for composing a reply to a message.
     */
    public function reply(Message $message)
    {
        // Check if user is allowed to reply to the message
        if (Auth::id() !== $message->from_user_id && Auth::id() !== $message->to_user_id) {
            abort(403, 'Unauthorized action.');
        }
        
        // Load related data
        $message->load(['sender', 'recipient', 'listing']);
        
        // Determine who to reply to (the other person in the conversation)
        $replyTo = Auth::id() === $message->from_user_id ? $message->recipient : $message->sender;
        
        return inertia('Messages/Reply', [
            'originalMessage' => $message,
            'recipient' => $replyTo,
            'listing' => $message->listing
        ]);
    }
}