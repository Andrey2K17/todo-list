<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Performer extends Model
{
    public $timestamps = false;

    protected $fillable = ['name', 'task_id'];

    public function task() {
        return $this->belongsTo(Task::class);
    }
}
