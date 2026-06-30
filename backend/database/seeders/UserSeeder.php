<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory(25)->create();  

        User::create([
            'username' => 'Yuu Haein', 
            'email' => 'private1@gmail.com', 
            'password' => Hash::make('12345678'), 
            'is_private' => true
        ]);

        User::create([
            'username' => 'private user', 
            'email' => 'private2@gmail.com', 
            'password' => Hash::make('12345678'), 
            'is_private' => true
        ]);
    }
}
