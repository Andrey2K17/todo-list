<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    public $timestamps = false;

    protected $fillable = ['date', 'category_id'];

    public function category() {
        return $this->hasOne(Category::class);
    }

    public function performers() {
        return $this->hasMany(Performer::class);
    }

    public function performerActions() {
        return $this->hasMany(PerformerAction::class);
    }
}
