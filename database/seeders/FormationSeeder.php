<?php

namespace Database\Seeders;

use App\Models\Cour;
use App\Models\Formation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FormationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Classe 1
        $html = Formation::create(["name" => "HTML5", "icon_name" => "mdi:language-html5"]);
        $css = Formation::create(["name" => "CSS3", "icon_name" => "mdi:language-css3"]);
        $sass = Formation::create(["name" => "SASS", "icon_name" => "mdi:sass"]);
        $tailwind = Formation::create(["name" => "Tailwindcss", "icon_name" => "mdi:tailwind"]);

        // Classe 2
        $js = Formation::create(["name" => "JavaScript", "icon_name" => "mdi:language-javascript"]);
        $ts = Formation::create(["name" => "TypeScript", "icon_name" => "mdi:language-typescript"]);
        $react = Formation::create(["name" => "React.js", "icon_name" => "mdi:react"]);

        // Classe 3
        $php = Formation::create(["name" => "PHP", "icon_name" => "mdi:language-php"]);
        $laravel = Formation::create(["name" => "Laravel", "icon_name" => "mdi:laravel"]);
        $inertia = Formation::create(["name" => "Inertia.js", "icon_name" => "mdi:puzzle-outline"]); // Using a generic icon for Inertia.js

        // Classe 4
        $python = Formation::create(["name" => "Python", "icon_name" => "mdi:language-python"]);
        $scripts = Formation::create(["name" => "Scripts d’automatisation", "icon_name" => "mdi:robot"]);

        // Classe 5
        $sql = Formation::create(["name" => "SQL", "icon_name" => "mdi:database"]);
        $git = Formation::create(["name" => "Git", "icon_name" => "mdi:git"]);

        // Classe 6
        $deploy = Formation::create(["name" => "Déploiement Web", "icon_name" => "mdi:cloud-upload"]);

        // Get cours
        $cours1 = Cour::where('name', 'Classe 1')->first();
        $cours2 = Cour::where('name', 'Classe 2')->first();
        $cours3 = Cour::where('name', 'Classe 3')->first();
        $cours4 = Cour::where('name', 'Classe 4')->first();
        $cours5 = Cour::where('name', 'Classe 5')->first();
        $cours6 = Cour::where('name', 'Classe 6')->first();

        // Attach formations to cours (many-to-many)
        $cours1?->formations()->attach([$html->id, $css->id, $sass->id, $tailwind->id]);
        $cours2?->formations()->attach([$js->id, $ts->id, $react->id]);
        $cours3?->formations()->attach([$php->id, $laravel->id, $inertia->id]);
        $cours4?->formations()->attach([$python->id, $scripts->id]);
        $cours5?->formations()->attach([$sql->id, $git->id]);
        $cours6?->formations()->attach([$deploy->id]);
    }
}
