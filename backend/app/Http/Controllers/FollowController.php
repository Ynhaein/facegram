<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FollowController extends Controller
{
    public function follow (string $username)
    {
        $targetUser = User::where('username', $username)->firstOrFail();  
        $user = Auth::user(); 

        if($user->id === $targetUser->id) {
            return response()->json([
                'success' => false, 
                'message' => 'Cannot follow urself'
            ]); 
        }

        if($user->following()->where('following_id', $targetUser->id)->exists()) {
            return response()->json([
                'success' => false, 
                'message' => 'already following' 
            ]); 
        }

        $user->following()->attach($targetUser->id); 
        return response()->json([
            'success' => true, 
            'message' => "success to following {$targetUser->username}"
        ]);

    }

    public function unfollow (string $username)
    {
        $targetUser = User::where('username', $username)->firstOrFail(); 
        $user = Auth::user();
        
        $user->following()->detach($targetUser->id); 
        return response()->json([
            'success' => true,
            'message' => "success to unfollowing {$targetUser->username}"
        ]);
    }  

    public function followers(Request $request) 
    {
        $user = Auth::user(); 
        $search = $request->query('search');    

        $followers = $user->followers()->when($search, function($query, $search) {
            $query->where('username', 'LIKE', "%{$search}%"); 
        })->withCount('followers')->select('users.id','users.username', 'users.is_private')->latest('follows.created_at')->paginate(10); 

        return response()->json([
            'success' => true, 
            'data' => $followers 
        ]);
    }

    public function following (Request $request) 
    {
        $user = Auth::user(); 
        $search = $request->query('search'); 

        $following = $user->following()->when($search, function($query, $search){
            $query->where('username', 'LIKE', "%{$search}%");
        })->withCount('followers')->select('users.id','users.username', 'users.is_private')->latest('follows.created_at')->paginate(10);

        return response()->json([
            'success' => true, 
            'data' => $following
        ]);
    } 

    public function userFollowers(string $username, Request $request)
    {
        $targetUser = User::where('username', $username)->firstOrFail();
        $authUser = Auth::user();

        // Cek private account
        if ($targetUser->is_private && $targetUser->id !== $authUser->id) {
            if (!$authUser->isMutualFollow($targetUser)) {
                return response()->json([
                    'success' => false,
                    'message' => 'This account is private.'
                ], 403);
            }
        }

        $search = $request->query('search');

        $followers = $targetUser->followers()
            ->when($search, function($query, $search) {
                $query->where('username', 'LIKE', "%{$search}%");
            })
            ->withCount('followers')
            ->select('users.id', 'users.username', 'users.is_private')
            ->latest('follows.created_at')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $followers
        ]);
    }

    public function userFollowing(string $username, Request $request)
    {
        $targetUser = User::where('username', $username)->firstOrFail();
        $authUser = Auth::user();

        // Cek private account
        if ($targetUser->is_private && $targetUser->id !== $authUser->id) {
            if (!$authUser->isMutualFollow($targetUser)) {
                return response()->json([
                    'success' => false,
                    'message' => 'This account is private.'
                ], 403);
            }
        }

        $search = $request->query('search');

        $following = $targetUser->following()
            ->when($search, function($query, $search) {
                $query->where('username', 'LIKE', "%{$search}%");
            })
            ->withCount('followers')
            ->select('users.id', 'users.username', 'users.is_private')
            ->latest('follows.created_at')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $following
        ]);
    }
}
