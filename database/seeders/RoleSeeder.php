<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::updateOrCreate(['name' => 'admin'], ['label' => 'Administrator']);
        Role::updateOrCreate(['name' => 'collaborator'], ['label' => 'Collaborator']);
        Role::updateOrCreate(['name' => 'student'], ['label' => 'Student']);
        Role::updateOrCreate(['name' => 'mentor'], ['label' => 'Mentor']);
        Role::updateOrCreate(['name' => 'manager'], ['label' => 'Manager']);
    }
}
