<?php

namespace Database\Seeders;

use App\Models\Classe;
use App\Models\Formation;
use App\Models\Speciality;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create([
            'name' => 'Ilyes rafai',
            'email' => 'ilyes@dhadx.com',
            'password' => 'password',
        ]);

        $this->call(SpecialitySeeder::class);
        $this->call(CollaboratorSeeder::class);
        $this->call(CourSeeder::class);
        $this->call(FormationSeeder::class);
    }
}
