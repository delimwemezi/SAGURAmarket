<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'price',
        'stock',
        'image',
        'model_3d'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
