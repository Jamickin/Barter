<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\IndexController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserAccountController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MessageController;

// Define the home route to display listings
Route::get('/', [IndexController::class, 'index']);
  
// Apply authentication middleware to create, destroy, store, edit, and update methods
Route::middleware('auth')->group(function () {
    Route::resource('listing', ListingController::class)
        ->only(['create', 'destroy', 'store', 'edit', 'update']);
    
    // Add route for updating listing status
    Route::patch('listing/{listing}/status', [ListingController::class, 'updateStatus'])
        ->name('listing.update-status');
    
    // Change logout to POST method for better security
    Route::post('logout', [AuthController::class, 'destroy'])->name('logout');
    
    // Messaging routes
    Route::get('/messages', [MessageController::class, 'index'])->name('messages.index');
    Route::get('/messages/create', [MessageController::class, 'create'])->name('messages.create');
    Route::post('/messages', [MessageController::class, 'store'])->name('messages.store');
    Route::get('/messages/{message}', [MessageController::class, 'show'])->name('messages.show');
    Route::get('/messages/{message}/reply', [MessageController::class, 'reply'])->name('messages.reply');
});

// Routes for listing without authentication middleware
Route::resource('listing', ListingController::class)
    ->only(['index', 'show']);

// Authentication routes
Route::get('login', [AuthController::class, 'create'])->name('login');
Route::post('login', [AuthController::class, 'store'])->name('login.store');

// User account routes
Route::resource('user-account', UserAccountController::class)
    ->only(['create', 'store', 'show']);

Route::post('register', [UserAccountController::class, 'store'])->name('register.store');

// Profile route
Route::get('profile/{id}', [ProfileController::class, 'show'])->name('profile.show');