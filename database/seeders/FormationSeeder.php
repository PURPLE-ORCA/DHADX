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
        $html = Formation::create(["name" => "HTML5"]);
        $css = Formation::create(["name" => "CSS3"]);
        $sass = Formation::create(["name" => "SASS"]);
        $tailwind = Formation::create(["name" => "Tailwindcss"]);

        // Classe 2
        $js = Formation::create(["name" => "JavaScript"]);
        $ts = Formation::create(["name" => "TypeScript"]);
        $react = Formation::create(["name" => "React.js"]);

        // Classe 3
        $php = Formation::create(["name" => "PHP"]);
        $laravel = Formation::create(["name" => "Laravel"]);
        $inertia = Formation::create(["name" => "Inertia.js"]);

        // Classe 4
        $python = Formation::create(["name" => "Python"]);
        $scripts = Formation::create(["name" => "Scripts d’automatisation"]);

        // Classe 5
        $sql = Formation::create(["name" => "SQL"]);
        $git = Formation::create(["name" => "Git"]);

        // Classe 6
        $deploy = Formation::create(["name" => "Déploiement Web"]);

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
