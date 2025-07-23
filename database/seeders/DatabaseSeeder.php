<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Collaborator; // <-- Make sure this is imported
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

        $collaboratorData = [
            // ... your data array is perfect, no changes needed ...
            ['name' => "Kacem Bensaadoun", 'email_prefix' => 'kacem.bensaadoun'],
            ['name' => "Mohammed El Moussaoui", 'email_prefix' => 'mohammed.elmoussaoui'],
            ['name' => "Rihane Chebab", 'email_prefix' => 'rihane.chebab'],
            ['name' => "Nadia Erraji", 'email_prefix' => 'nadia'],
            ['name' => "Kaouthar Missaoui", 'email_prefix' => 'kaouthar.missaoui'],
            ['name' => "Yassmine Boukhana", 'email_prefix' => 'yassmine.boukhana'],
            ['name' => "Ilyass Hajji", 'email_prefix' => 'ilyass.hajji'],
            ['name' => "Oussama Grioui", 'email_prefix' => 'oussama.grioui'],
            ['name' => "Khaoula Rezzouq", 'email_prefix' => 'khaoula.rezzouq'],
            ['name' => "Oumaima Rahouti", 'email_prefix' => 'oumaima.rahouti'],
            ['name' => "Amine Jhilel", 'email_prefix' => 'amine.jhilel'],
            ['name' => "Saad Iherdrane", 'email_prefix' => 'saad.iherdrane'],
            ['name' => "Imad Rafai", 'email_prefix' => 'imad.rafai'],
            ['name' => "Ilyes Rafai", 'email_prefix' => 'ilyes.rafai'],
        ];

        foreach ($collaboratorData as $data) {
            $email = $data['email_prefix'] . '@dhadx.com';
            
            // Step 1: Create the User record
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $data['name'],
                    'password' => bcrypt('password'), 
                ]
            );

            // --- THE FIX IS HERE ---
            // Step 2: Create the corresponding Collaborator record and LINK it
            Collaborator::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $data['name'],
                    'user_id' => $user->id, // <-- THE MISSING LINK!
                ]
            );
            // --- END FIX ---

            // Step 3: Assign roles (your existing logic is correct)
            if ($data['name'] === 'Ilyes Rafai' && $adminRole) {
                $user->roles()->syncWithoutDetaching($adminRole->id);
            }
            if ($collaboratorRole) {
                $user->roles()->syncWithoutDetaching($collaboratorRole->id);
            }
        }

        // Call other seeders, but NOT the old collaborator seeder
        $this->call(SpecialitySeeder::class);
        // $this->call(CollaboratorSeeder::class); // <-- DELETE OR COMMENT OUT THIS LINE
        $this->call(CourSeeder::class);
        $this->call(FormationSeeder::class);
    }
}