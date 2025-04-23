<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Listing;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function show($id,Listing $listing)
    {
        $listing->load('owner');
        $user = User::findOrFail($id);
        $currentUser = Auth::user();
        return inertia('Profile/Show', [
            'listing' => $listing,
            'user' => $user,
            'listings' => $user->listings,
            'currentUser' => $currentUser ? $currentUser->only('id', 'is_admin') : null,
        ]);
    }
}
