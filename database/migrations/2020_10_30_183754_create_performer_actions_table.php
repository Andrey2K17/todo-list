<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePerformerActionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('performer_actions', function (Blueprint $table) {
            $table->id();
            $table->time('startTime', 0);
            $table->time('endTime', 0);
            $table->string('action');
            $table->boolean('isCompleted');
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('performer_actions');
    }
}
