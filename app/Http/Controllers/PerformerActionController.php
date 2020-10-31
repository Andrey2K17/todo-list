<?php

namespace App\Http\Controllers;

use App\PerformerAction;
use Illuminate\Http\Request;

class PerformerActionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $performerAction = PerformerAction::all();
        return response()->json(['status' => 200, 'performerAction' => $performerAction]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $newPerformerAction = PerformerAction::create([
            'startTime' => $request->startTime,
            'endTime' => $request->endTime,
            'action' => $request->action,
            'isCompleted' => $request->isCompleted,
            'task_id' => $request->task_id,
        ]);

        if($newPerformerAction) {
            return response()->json(['status' => 200, 'performerAction' => $newPerformerAction]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\PerformerAction  $performerAction
     * @return \Illuminate\Http\Response
     */
    public function show(PerformerAction $performerAction)
    {
        return response()->json($performerAction);
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
        $newPerformerAction = PerformerAction::find($id);
        $newPerformerAction->startTime = $request->startTime;
        $newPerformerAction->endTime = $request->endTime;
        $newPerformerAction->action = $request->action;
        $newPerformerAction->isCompleted = $request->isCompleted;
        $newPerformerAction->task_id = $request->task_id;
        if($newPerformerAction->save()) {
            return response()->json(['status' => 200]);
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
        $performerAction = PerformerAction::find($id);
        if ($performerAction->delete()) {
            return response()->json(['status' => 200]);
        }
    }
}
