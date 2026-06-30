<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; 
use App\Models\Post; 

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasApiTokens, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */

    protected $fillable = [
        'username', 
        'email', 
        'password', 
        'is_private' 
    ];

    protected $hidden = ['password'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    } 

    public function posts () 
    {
       return $this->hasMany(Post::class); 
    }  

    // siapa yang mem-follow user ini
    public function followers()
    {
        return $this->belongsToMany(User::class, 'follows', 'following_id', 'follower_id')->withTimestamps();
    }

    // siapa yang di-follow user ini
    public function following()
    {
        return $this->belongsToMany(User::class, 'follows', 'follower_id', 'following_id')->withTimestamps();
    }


    public function isFollowing(User $user)
    {
        return $this->following()->where('following_id', $user->id)->exists();  
    }
 
    public function isMutualFollow(User $otherUser):bool
    {   
        return $this->following()->where('following_id', $otherUser->id)->exists() && 
        $otherUser->following()->where('following_id', $this->id)->exists(); 
    }
}
