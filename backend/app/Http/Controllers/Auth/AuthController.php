<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register (RegisterRequest $request)
    {   
        $validated = $request->validated(); 
        $validated['password'] = Hash::make($validated['password']);  

        $user = User::create($validated); 
        $token = $user->createToken('auth-token')->plainTextToken; 
        
        return response()->json([
            'success' => true, 
            'message' => 'register success', 
            'data' => [
                'user' => $user, 
                'token' => $token 
            ]
        ]);
    }

    public function login (LoginRequest $request)  
    {
        $validated = $request->validated(); 
        $user = User::where('email', $validated['email'])->first(); 
        
        if(!$user) {
            return response()->json([
                'success' => false, 
                'message' => 'email not found'
            ]); 
        } 

        if(!Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'success' => false, 
                'message' => 'wrong password'
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;  
        return response()->json([
            'success' => true, 
            'message' => 'login success', 
            'data' => [
                'user' => $user, 
                'token' => $token
            ]
        ]);
    }

    public function logout () 
    {
        /** @var User */
        $user = Auth::user(); 
        $user->currentAccessToken()->delete(); 

        return response()->json([
            'success' => true, 
            'message' => 'log out success'
        ]);
    }

    public function profile ()
    {
        /** @var User */ 
        $user = Auth::user(); 
        $user->load([
            'posts' => function($query) {
                $query->latest()->with('attachments'); 
            }, 

            'followers',  
            'following' 
        ]);

        return response()->json([
            'success' => true, 
            'data' => [
                'user' => $user,
                'posts' => $user->posts, 
                'followers_count' => $user->followers->count(), 
                'following_count' => $user->following->count()
            ]
        ]);
    }
}