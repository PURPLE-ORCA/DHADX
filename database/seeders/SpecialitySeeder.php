<?php

namespace Database\Seeders;

use App\Models\Speciality;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SpecialitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Speciality::create([
            "name" => "Fullstack developer"
        ]);

        Speciality::create([
            "name" => "Frontend developer"
        ]);

        Speciality::create([
            "name" => "Backend developer"
        ]);

        Speciality::create([
            "name" => "Designer"
        ]);

        Speciality::create([
            "name" => "Video editor"
        ]);
        Speciality::create([
            "name" => "Content creator"
        ]);
    }
}
