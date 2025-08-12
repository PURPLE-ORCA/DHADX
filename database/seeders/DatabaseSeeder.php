<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
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
        $studentRole = Role::where('name', 'student')->first();
        $mentorRole = Role::where('name', 'mentor')->first();
        $managerRole = Role::where('name', 'manager')->first();

        $specialities = [
            'frontend' => \App\Models\Speciality::firstOrCreate(['name' => "Frontend developer"]),
            'backend' => \App\Models\Speciality::firstOrCreate(['name' => "Backend developer"]),
            'fullstack' => \App\Models\Speciality::firstOrCreate(['name' => "Fullstack developer"]),
            'designer' => \App\Models\Speciality::firstOrCreate(['name' => "Designer"]),
            'montage' => \App\Models\Speciality::firstOrCreate(['name' => "Video editor"]),
            'content creator' => \App\Models\Speciality::firstOrCreate(['name' => "Content creator"]),
        ];

        $usersData = [
            ['name' => "Kacem Bensaadoun", 'email_prefix' => 'kacem.bensaadoun', 'gender' => 'male', 'specialities' => ['frontend']],
            ['name' => "Rihane Chebab", 'email_prefix' => 'rihane.chebab', 'gender' => 'female', 'specialities' => ['frontend']],
            ['name' => "Nadia Erraji", 'email_prefix' => 'nadia', 'gender' => 'female', 'specialities' => ['montage']],
            ['name' => "Kaouthar Missaoui", 'email_prefix' => 'kaouthar.missaoui', 'gender' => 'female', 'specialities' => ['frontend']],
            ['name' => "Yassmine Boukhana", 'email_prefix' => 'yassmine.boukhana', 'gender' => 'female', 'specialities' => ['frontend']],
            ['name' => "Ilyass Hajji", 'email_prefix' => 'ilyass.hajji', 'gender' => 'male', 'specialities' => ['designer']],
            ['name' => "Oussama Grioui", 'email_prefix' => 'oussama.grioui', 'gender' => 'male', 'specialities' => ['frontend']],
            ['name' => "Khaoula Rezzouq", 'email_prefix' => 'khaoula.rezzouq', 'gender' => 'female', 'specialities' => ['frontend']],
            ['name' => "Oumaima Rahouti", 'email_prefix' => 'oumaima.rahouti', 'gender' => 'female', 'specialities' => ['frontend']],
            ['name' => "Amine Jhilel", 'email_prefix' => 'amine.jhilel', 'gender' => 'male', 'specialities' => ['frontend']],
            ['name' => "Saad Iherdrane", 'email_prefix' => 'saad.iherdrane', 'gender' => 'male', 'specialities' => ['frontend']],
            ['name' => "Mohammed El Moussaoui", 'email_prefix' => 'mohammed.elmoussaoui', 'gender' => 'male', 'specialities' => ['fullstack']],
            ['name' => "Imad Rafai", 'email_prefix' => 'imad.rafai', 'gender' => 'male', 'specialities' => ['mentor', 'backend', 'montage']],
            ['name' => "Ilyes Rafai", 'email_prefix' => 'ilyes.rafai', 'gender' => 'male', 'specialities' => ['mentor', 'fullstack', 'montage', 'designer']],
        ];

        foreach ($usersData as $data) {
            $email = $data['email_prefix'] . '@dhadx.com';
            
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $data['name'],
                    'password' => bcrypt('password'),
                    'birth_date' => '2000-01-01', // Dummy birth date
                    'cin' => 'AB123456', // Dummy CIN
                    'gender' => $data['gender'],
                    'image' => null, // No image for now
                ]
            );

            if ($data['name'] === 'Ilyes Rafai' && $adminRole) {
                $user->roles()->syncWithoutDetaching($adminRole->id);
            }
            if ($collaboratorRole) {
                $user->roles()->syncWithoutDetaching($collaboratorRole->id);
            }

            // Attach specialities
            foreach ($data['specialities'] as $specialityName) {
                if (isset($specialities[$specialityName])) {
                    $user->specialities()->attach($specialities[$specialityName]->id);
                }
            }
        }

        // $this->call(SpecialitySeeder::class);
        $this->call(CourSeeder::class);
        $this->call(FormationSeeder::class);
    }
}