<?php

namespace Database\Seeders;

use App\Models\Cour;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CourSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Cour::create([
            "name" => "Classe 1",
            "color" => "#46BDF2",
            "label" => " Fondamentaux du Web – HTML, CSS, SASS & Tailwind CSS",
        ]);

        Cour::create([
            "name" => "Classe 2",
            "color" => "#E5672E",
            "label" => "Programmation Frontend – JavaScript, TypeScript & React.js",
        ]);

        Cour::create([
            "name" => "Classe 3",
            "color" => "#92DD6B",
            "label" => "Backend Moderne – PHP, Laravel & Inertia.js",
        ]);

        Cour::create([
            "name" => "Classe 4",
            "color" => "#E0325D",
            "label" => "Automatisation & Scripts – Python",
        ]);

        Cour::create([
            "name" => "Classe 5",
            "color" => "#FFDC38",
            "label" => "Gestion des données & Versioning",
        ]);

        Cour::create([
            "name" => "Classe 6",
            "color" => "#57436A",
            "label" => "Déploiement Web",
        ]);
    }
}
