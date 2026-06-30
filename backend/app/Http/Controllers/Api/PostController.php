<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Post\StorePostRequest;
use App\Models\Attachment;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage; 

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        $posts = Post::with(['user', 'attachments'])
            ->where(function ($query) use ($user) {
                // post user
                $query->where('user_id', $user->id)
                    // post from following user
                    ->orWhereIn('user_id', $user->following()->pluck('following_id'));
            })
            ->where(function ($query) use ($user) {
                $query->whereHas('user', function ($q) {
                    $q->where('is_private', false); 
                })
                ->orWhereHas('user', function ($q) use ($user) {
                    $q->where('is_private', true)
                    ->whereIn('id', $user->followers()->pluck('follower_id')); // mutual follow
                });
            })->latest()->paginate(5);


        return response()->json([
            'success' => true,
            'data' => $posts
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request)
    {
        $user = Auth::user(); 
        $validated = $request->validated(); 

        $post = Post::create([
            'user_id' => $user->id,  
            'caption' => $validated['caption']
        ]);  

        if(isset($validated['attachments'])) {
            foreach($validated['attachments'] as $file) {
                $filename = time() . '_' . $file->getClientOriginalName(); 
                $path = $file->storeAs('posts/'. $user->id, $filename, 'public'); 
                
                Attachment::create([
                    'post_id' => $post->id, 
                    'file_path' => $path, 
                    'file_name' => $file->getClientOriginalName(), 
                    'mime_type' => $file->getMimeType() 
                ]);
            }
        } 

        $post->load('attachments'); 

        return response()->json([
            'success' => true, 
            'message' => 'create post successfully', 
            'data' => $post 
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $post = Post::findOrFail($id); 
        
        if($post->user_id !== Auth::id()) {
            return response()->json([
                'success' => false, 
                'message' => 'Unauthorized: You can only delete your own post'
            ]);
        }   

        foreach($post->attachments as $attachment) {
            Storage::disk('public')->delete($attachment->file_path); 
        }

        $post->delete(); 

        return response()->json([
            'success' => true, 
            'message' => 'delete post successfully', 
            'data' => $post 
        ]);
    }
}
