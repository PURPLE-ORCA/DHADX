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
            "level" => 1,
        ]);

        Cour::create([
            "name" => "Classe 2",
            "color" => "#E5672E",
            "label" => "Programmation Frontend – JavaScript, TypeScript & React.js",
            "level" => 2,
        ]);

        Cour::create([
            "name" => "Classe 3",
            "color" => "#92DD6B",
            "label" => "Backend Moderne – PHP, Laravel & Inertia.js",
            "level" => 3,
        ]);

        Cour::create([
            "name" => "Classe 4",
            "color" => "#E0325D",
            "label" => "Automatisation & Scripts – Python",
            "level" => 4,
        ]);

        Cour::create([
            "name" => "Classe 5",
            "color" => "#FFDC38",
            "label" => "Gestion des données & Versioning",
            "level" => 5,
        ]);

        Cour::create([
            "name" => "Classe 6",
            "color" => "#57436A",
            "label" => "Déploiement Web",
            "level" => 6,
        ]);
    }
}