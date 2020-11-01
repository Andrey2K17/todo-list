<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PerformerAction extends Model
{
    public $timestamps = false;

    protected $fillable = ['startTime', 'endTime', 'action', 'isCompleted', 'task_id'];

    public function task() {
        return $this->belongsTo(Task::class);
    }
}
