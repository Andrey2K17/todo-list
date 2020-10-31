<?php

namespace App\Http\Controllers;

use App\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $tasks = Task::all();
        return response()->json(['status' => 200, 'tasks' => $tasks]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $newTask = Task::create([
            'date' => $request->date,
            'category_id' => $request->category_id,
        ]);

        if($newTask) {
            return response()->json(['status' => 200, 'taskId'=>$newTask->id]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function show(Task $task)
    {
        return response()->json($task);
    }

    public function performers(Task $task) {
        return response()->json(['status' => 200, 'performers' => $task->performers()->get()]);
    }

    public function performerActions(Task $task) {
        return response()->json(['status' => 200, 'performerActions' => $task->performerActions()->get()]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $newTask = Task::find($id);
        $newTask->date = $request->date;
        $newTask->category_id = $request->category_id;
        if($newTask->save()) {
            return response()->json(['status' => 200, 'taskId'=>$id]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $task = Task::find($id);
        if ($task->delete()) {
            return response()->json(['status' => 200]);
        }
    }
}
