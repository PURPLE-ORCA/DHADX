<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role; // Import Role model
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call RoleSeeder FIRST so roles exist
        $this->call(RoleSeeder::class);

        // Fetch roles once after they've been seeded
        $adminRole = Role::where('name', 'admin')->first();
        $collaboratorRole = Role::where('name', 'collaborator')->first();

        // Create Ilyes and assign role(s)
        $ilyes = User::create([
            'name' => 'Ilyes rafai',
            'email' => 'ilyes@dhadx.com',
            'password' => bcrypt('password'), 
        ]);

        if ($ilyes && $adminRole) { // Assign Ilyes as admin
            $ilyes->roles()->attach($adminRole->id);
        }
        // If Ilyes is also a collaborator (or just one or the other)
        // if ($ilyes && $collaboratorRole) {
        //     $ilyes->roles()->attach($collaboratorRole->id);
        // }


        // Create Mohammed and assign role(s)
        $mohammed = User::create([
            'name' => 'El Moussaoui Mohammed',
            'email' => 'mohammed@dhadx.com',
            'password' => bcrypt('password'), 
        ]);

        // Example: Assign Mohammed as collaborator
        if ($mohammed && $collaboratorRole) {
            $mohammed->roles()->attach($collaboratorRole->id);
        }
        // Or if Mohammed is also an admin (unlikely if Ilyes is the main admin)
        // if ($mohammed && $adminRole) {
        //    $mohammed->roles()->attach($adminRole->id);
        // }

        // Call other seeders
        $this->call(SpecialitySeeder::class);
        $this->call(CollaboratorSeeder::class);
        $this->call(CourSeeder::class);
        $this->call(FormationSeeder::class);

    }
}
