<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index (Request $request)
    {
        $search = $request->query('search'); 
        $users = User::query()->when($search, function ($query, $search) {
            $query->where('username', 'LIKE', "%{$search}%"); 
        })->select('id', 'username', 'is_private')->latest()->paginate(10);  

        return response()->json([
            'success' => true, 
            'data' => $users
        ]);
    }  

    public function suggested ()
    {
        $user = Auth::user(); 
        $suggested = User::where('id', '!=', $user->id)
        ->whereNotIn('id', $user->following()->pluck('following_id')) 
        ->inRandomOrder()
        ->take(5)
        ->select('id', 'username', 'is_private')
        ->get(); 

        return response()->json([
            'success' => true, 
            'data' => $suggested
        ]);
    }
}
