<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\IndexController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserAccountController;
use App\Http\Controllers\ProfileController;

// Define the home route to display listings
Route::get('/', [IndexController::class, 'index']);
  
// Apply authentication middleware to create, destroy, store, edit, and update methods
Route::middleware('auth')->group(function () {
    Route::resource('listing', ListingController::class)
        ->only(['create', 'destroy', 'store', 'edit', 'update']);
});

// Routes for listing without authentication middleware
Route::resource('listing', ListingController::class)
    ->only(['index', 'show']); // Add other methods if needed

// Authentication routes
Route::get('login', [AuthController::class, 'create'])->name('login');
Route::post('login', [AuthController::class, 'store'])->name('login.store');
Route::get('logout', [AuthController::class, 'destroy'])->name('logout');

// User account routes
Route::resource('user-account', UserAccountController::class)
    ->only(['create', 'store', 'show']);

Route::post('register', [UserAccountController::class, 'store'])->name('register.store');

// Profile route
Route::get('profile/{id}', [ProfileController::class, 'show'])->name('profile.show');
// routes/web.php

