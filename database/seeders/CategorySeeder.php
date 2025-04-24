<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Electronics',
            'Furniture',
            'Clothing',
            'Books',
            'Tools',
            'Sports Equipment',
            'Art',
            'Collectibles',
            'Toys & Games',
            'Home Decor',
            'Vehicles',
            'Services',
            'Other'
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category,
                'slug' => Str::slug($category)
            ]);
        }
    }
}