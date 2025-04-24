<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ListingController extends Controller
{   
    public function __construct()
    {
        $this->authorizeResource(Listing::class, 'listing');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Listing::with(['owner', 'category']);  // Eager load owner and category

        // Handle search functionality
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('tradeWhat', 'like', "%{$search}%")
                  ->orWhere('forWhat', 'like', "%{$search}%");
            });
        }

        // Filter by category if provided
        if ($request->has('category') && $request->get('category')) {
            $query->where('category_id', $request->get('category'));
        }

        $listings = $query->orderByDesc('created_at')
                         ->paginate(9)
                         ->withQueryString();

        // Add status display information to each listing
        foreach ($listings as $listing) {
            $listing->status_display = $listing->getStatusDisplay();
        }

        return inertia(
            'Listing/Index',
            [
                'listings' => $listings,
                'filters' => [
                    'search' => $request->get('search', ''),
                    'category' => $request->get('category', '')
                ],
                'categories' => Category::select('id', 'name')->orderBy('name')->get()
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Listing $listing)
    {
        $this->authorize('create', $listing);

        return inertia('Listing/Create', [
            'categories' => Category::select('id', 'name')->orderBy('name')->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tradeWhat' => 'required|string',
            'forWhat' => 'required|string',
            'category_id' => 'required|exists:categories,id'
        ]);

        $request->user()->listings()->create($validated);

        return redirect()->route('listing.index')
            ->with('success', 'Listing was created!');
    }

    /**
     * Display the specified resource.
     *
     * @param  Listing  $listing
     * @return \Illuminate\Http\Response
     */
    public function show(Listing $listing)
    {
        // Eager load the owner and category relationships
        $listing->load(['owner', 'category']);
        
        // Add status display information
        $listing->status_display = $listing->getStatusDisplay();

        return inertia('Listing/Show', [
            'listing' => $listing,
            'owner' => $listing->owner, // Pass the owner information to the view
            'category' => $listing->category
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  Listing  $listing
     * @return \Illuminate\Http\Response
     */
    public function edit(Listing $listing)
    {
        return inertia(
            'Listing/Edit',
            [
                'listing' => $listing,
                'categories' => Category::select('id', 'name')->orderBy('name')->get()
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Listing  $listing
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Listing $listing)
    {
        $validated = $request->validate([
            'tradeWhat' => 'required|string',
            'forWhat' => 'required|string',
            'category_id' => 'required|exists:categories,id'
        ]);

        $listing->update($validated);

        return redirect()->route('listing.index')
            ->with('success', 'Listing was changed!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Listing  $listing
     * @return \Illuminate\Http\Response
     */
    public function destroy(Listing $listing)
    {
        $listing->delete();

        return redirect()->back()
            ->with('success', 'Listing was deleted!');
    }
    
    /**
     * Update the status of the listing.
     *
     * @param  Request  $request
     * @param  Listing  $listing
     * @return \Illuminate\Http\Response
     */
    public function updateStatus(Request $request, Listing $listing)
    {
        $this->authorize('update', $listing);
        
        $validated = $request->validate([
            'status' => 'required|in:available,pending,completed',
        ]);

        $listing->update(['status' => $validated['status']]);

        return redirect()->back()
            ->with('success', 'Listing status updated!');
    }
}