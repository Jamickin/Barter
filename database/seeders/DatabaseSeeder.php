<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Listing;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
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
            Listing::factory()->count(rand(1, 5))->create([
                'by_user_id' => $user->id,
            ]);
        }
    }
}
