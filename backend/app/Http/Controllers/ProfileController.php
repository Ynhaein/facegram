<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;


class ProfileController extends Controller
{
    public function show(string $username) 
    {
        $targetUser = User::where('username', $username)->with(['posts.attachment', 'followers', 'following'])->firstOrFail();  
        $authUser = Auth::user(); 
        
        if($targetUser->is_private && $targetUser->id !== $authUser->id) {
            if(!$authUser->isMutualFollow($targetUser)) {
                return response()->json([
                    'success' => false, 
                    'message' => 'This account is private. Only friends (mutual followers) can see it.' 
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'targetUser' => $targetUser,
                'posts' => $targetUser->posts,
                'followers_count' => $targetUser->followers->count(),
                'following_count' => $targetUser->following->count(),
                'is_following' => $authUser->isFollowing($targetUser)
            ]
        ]);
    }
}
