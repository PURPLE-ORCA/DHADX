<?php

namespace Database\Seeders;

use App\Models\Collaborator;
use App\Models\Speciality;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CollaboratorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupère ou crée les spécialités
        $frontendSpeciality = Speciality::firstOrCreate(['name' => "Frontend developer"]);
        $backendSpeciality = Speciality::firstOrCreate(['name' => "Backend developer"]);
        $fullstackSpeciality = Speciality::firstOrCreate(['name' => "Fullstack developer"]);
        $designerSpeciality = Speciality::firstOrCreate(['name' => "Designer"]);
        $montageSpeciality = Speciality::firstOrCreate(['name' => "Video editor"]);
        $mentorSpeciality = Speciality::firstOrCreate(['name' => "Mentor"]);

        // Crée les collaborateurs
        $collaborators = [
            "Kacem Bensaadoun",
            "Mohammed Moussaoui",
            "Rihane Chebab",
            "Nadia",
            "Kaouthar Missaoui",
            "Yassmine Boukhana",
            "Ilyass Hajji",
            "Oussama Grioui",
            "Khaoula  Rezzouq",
            "Oumaima Rahouti",
            "Amine Jhilel",
            "Saad Iherdrane",
            "Imad Rafai",
            "Ilyes Rafai"
        ];

        foreach ($collaborators as $name) {
            $collaborator = Collaborator::create([
                'name' => $name
            ]);

            $excludedNames = ["Mohammed Moussaoui", "Ilyes Rafai", "Imad Rafai"];

            if (!in_array($name, $excludedNames)) {
                $collaborator->specialities()->attach($frontendSpeciality->id);
            }
        }

        // Récupère les collaborateurs de manière plus sûre
        $med = Collaborator::where('name', 'Mohammed Moussaoui')->first();
        $nadia = Collaborator::where('name', 'Nadia')->first();
        $hajji = Collaborator::where('name', 'Ilyass Hajji')->first();
        $imad_rafai = Collaborator::where('name', 'Imad Rafai')->first();
        $ilyes_rafai = Collaborator::where('name', 'Ilyes Rafai')->first();

        if ($imad_rafai && $mentorSpeciality) {
            $imad_rafai->specialities()->attach([$mentorSpeciality->id, $backendSpeciality->id, $montageSpeciality->id]);
        }

        if ($ilyes_rafai && $mentorSpeciality) {
            $ilyes_rafai->specialities()->attach([$mentorSpeciality->id, $fullstackSpeciality->id, $montageSpeciality->id, $designerSpeciality->id]);
        }

        if ($hajji && $designerSpeciality) {
            $hajji->specialities()->attach($designerSpeciality->id);
        }

        if ($med && $fullstackSpeciality) {
            $med->specialities()->attach($fullstackSpeciality->id);
        }

        if ($nadia && $montageSpeciality) {
            $nadia->specialities()->attach($montageSpeciality->id);
        }
    }
}
