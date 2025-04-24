<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Listing;
use App\Models\Category;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Seed categories first
        $this->call(CategorySeeder::class);
        
        // Get all categories for random assignment
        $categories = Category::all();
        
        // Create users
        $users = User::factory(10)->create();
        $users->push(
            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'is_admin' => true
            ])
        );
        $users->push(
            User::factory()->create([
                'name' => 'Test User2',
                'email' => 'test2@example.com',
                'is_admin' => false
            ])
        );

        // Create listings for each user
        foreach ($users as $user) {
            Listing::factory()->count(rand(1, 5))->make([
                'by_user_id' => $user->id,
            ])->each(function ($listing) use ($categories) {
                // Assign a random category to each listing
                $listing->category_id = $categories->random()->id;
                $listing->save();
            });
        }
    }
}