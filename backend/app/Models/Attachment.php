<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Post; 

class Attachment extends Model
{
    protected $fillable = [
        'post_id', 
        'file_path', 
        'file_name', 
        'mime_type'
    ]; 

    public function posts () 
    {
        return $this->belongsTo(Post::class); 
    }
}
