<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User; 
use App\Models\Attachment; 

class Post extends Model
{
    protected $fillable = [
        'user_id', 
        'title', 
        'caption' 
    ];

    public function user () 
    {
        return $this->belongsTo(User::class); 
    } 

    public function attachments () 
    {
        return $this->hasMany(Attachment::class); 
    }
}
