<?php

namespace Database\Seeders;

use App\Models\Collaborator;
use App\Models\Speciality;
use App\Models\User; // Import User
use Illuminate\Database\Seeder;

class CollaboratorSeeder extends Seeder
{
    public function run(): void
    {
        $frontendSpeciality = Speciality::firstOrCreate(['name' => "Frontend developer"]);
        $backendSpeciality = Speciality::firstOrCreate(['name' => "Backend developer"]);
        $fullstackSpeciality = Speciality::firstOrCreate(['name' => "Fullstack developer"]);
        $designerSpeciality = Speciality::firstOrCreate(['name' => "Designer"]);
        $montageSpeciality = Speciality::firstOrCreate(['name' => "Video editor"]);
        $mentorSpeciality = Speciality::firstOrCreate(['name' => "Mentor"]);

        $collaboratorData = [ // Define name and if they should have a user account (with email)
            ['name' => "Kacem Bensaadoun", 'email_prefix' => 'kacem.bensaadoun'],
            ['name' => "Mohammed El Moussaoui", 'email_prefix' => 'mohammed.elmoussaoui', 'is_user' => true], // User created in DatabaseSeeder
            ['name' => "Rihane Chebab", 'email_prefix' => 'rihane.chebab'],
            ['name' => "Nadia", 'email_prefix' => 'nadia'],
            ['name' => "Kaouthar Missaoui", 'email_prefix' => 'kaouthar.missaoui'],
            ['name' => "Yassmine Boukhana", 'email_prefix' => 'yassmine.boukhana'],
            ['name' => "Ilyass Hajji", 'email_prefix' => 'ilyass.hajji'],
            ['name' => "Oussama Grioui", 'email_prefix' => 'oussama.grioui'],
            ['name' => "Khaoula Rezzouq", 'email_prefix' => 'khaoula.rezzouq'],
            ['name' => "Oumaima Rahouti", 'email_prefix' => 'oumaima.rahouti'],
            ['name' => "Amine Jhilel", 'email_prefix' => 'amine.jhilel'],
            ['name' => "Saad Iherdrane", 'email_prefix' => 'saad.iherdrane'],
            ['name' => "Imad Rafai", 'email_prefix' => 'imad.rafai', 'is_user' => true],       // User created in DatabaseSeeder
            ['name' => "Ilyes Rafai", 'email_prefix' => 'ilyes.rafai', 'is_user' => true],        // User created in DatabaseSeeder
        ];

        foreach ($collaboratorData as $data) {
            $user = null;
            $userEmail = null;

            // Attempt to find the user if they were created in DatabaseSeeder
            if (isset($data['is_user']) && $data['is_user']) {
                if ($data['name'] === 'Ilyes Rafai') $user = User::where('email', 'ilyes@dhadx.com')->first();
                else if ($data['name'] === 'Mohammed El Moussaoui') $user = User::where('email', 'mohammed@dhadx.com')->first();
                else if ($data['name'] === 'Imad Rafai') $user = User::where('email', 'imad@dhadx.com')->first();
            }
            
            $collaborator = Collaborator::create([
                'name' => $data['name'],
                'user_id' => $user ? $user->id : null,
                'email' => $user ? $user->email : null, // Store user's email if linked
            ]);

            $excludedNames = ["Mohammed El Moussaoui", "Ilyes Rafai", "Imad Rafai"];
            if (!in_array($data['name'], $excludedNames) && $frontendSpeciality) {
                $collaborator->specialities()->attach($frontendSpeciality->id);
            }
        }
        $medCollaborator = Collaborator::where('name', 'Mohammed El Moussaoui')->first();
        if ($medCollaborator && $fullstackSpeciality) {
            $medCollaborator->specialities()->attach($fullstackSpeciality->id);
        }

        $hajji = Collaborator::where('name', 'Ilyass Hajji')->first();
        if ($hajji && $designerSpeciality) {
            $hajji->specialities()->attach($designerSpeciality->id);
        }

        $imad_rafai = Collaborator::where('name', 'Imad Rafai')->first();
        if ($imad_rafai && $mentorSpeciality) {
            $imad_rafai->specialities()->attach([$mentorSpeciality->id, $backendSpeciality->id, $montageSpeciality->id]);
        }

        $ilyes_rafai = Collaborator::where('name', 'Ilyes Rafai')->first();
        if ($ilyes_rafai && $mentorSpeciality) {
            $ilyes_rafai->specialities()->attach([$mentorSpeciality->id, $fullstackSpeciality->id, $montageSpeciality->id, $designerSpeciality->id]);
        }

        $nadia = Collaborator::where('name', 'Nadia')->first();
        if ($nadia && $montageSpeciality) {
            $nadia->specialities()->attach($montageSpeciality->id);
        }
    }
}
