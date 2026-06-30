<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class Follow extends Pivot
{
    protected $table = 'follows';

    public $timestamps = true;
}