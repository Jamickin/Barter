<?php

namespace App\Http\Controllers;

use App\Models\Listing;
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
    public function index()
    {
        return inertia(
            'Listing/Index',
            [
                'listings' => Listing::with('owner')  // Eager load owner
                    ->orderByDesc('created_at')
                    ->paginate(9)
                    ->withQueryString()
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

        return inertia('Listing/Create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'tradeWhat' => 'required|string',
            'forWhat' => 'required|string'
        ]);

        $request->user()->listings()->create($request->all());

        return redirect()->route('listing.index')
            ->with('success', 'Listing was created!');
    }

    /**
 * Show the form for creating an offer based on the specified listing.
 *
 * @param  Listing  $listing
 * @return \Illuminate\Http\Response
 */
    public function createOffer(Listing $listing)
    {
        // Eager load the owner relationship for the listing
        $listing->load('owner');

        return inertia('Listing/CreateOffer', [
            'listing' => $listing
        ]);
}

    /**
     * Display the specified resource.
     *
     * @param  Listing  $listing
     * @return \Illuminate\Http\Response
     */
    public function show(Listing $listing)
    {
        // Eager load the owner relationship
        $listing->load('owner');

        return inertia('Listing/Show', [
            'listing' => $listing,
            'owner' => $listing->owner // Pass the owner information to the view
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
                'listing' => $listing
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
        $request->validate([
            'tradeWhat' => 'required|string',
            'forWhat' => 'required|string'
        ]);

        $listing->update($request->all());

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
}
