<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Listing extends Model
{
    use HasFactory;

    protected $fillable = ['tradeWhat', 'forWhat', 'category_id', 'status'];
    
    /**
     * Get the user that owns the listing.
     */
    public function owner(): BelongsTo 
    {
        return $this->belongsTo(
            \App\Models\User::class,
            'by_user_id'
        );
    }
  
    /**
     * Get the category of the listing.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
    
    /**
     * Get status display text with correct formatting
     * 
     * @return array
     */
    public function getStatusDisplay(): array
    {
        $statusMap = [
            'available' => [
                'text' => 'Available',
                'color' => 'green',
                'bg_color' => 'bg-green-100 dark:bg-green-800'
            ],
            'pending' => [
                'text' => 'Trade Pending',
                'color' => 'orange',
                'bg_color' => 'bg-orange-100 dark:bg-orange-800'
            ],
            'completed' => [
                'text' => 'Completed',
                'color' => 'blue',
                'bg_color' => 'bg-blue-100 dark:bg-blue-800'
            ]
        ];
        
        return $statusMap[$this->status] ?? [
            'text' => ucfirst($this->status),
            'color' => 'gray',
            'bg_color' => 'bg-gray-100 dark:bg-gray-800'
        ];
    }
}