<?php

namespace App\Http\Controllers;

use App\Performer;
use Illuminate\Http\Request;

class PerformerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $performers = Performer::all();
        return response()->json(['status' => 200, 'performers' => $performers]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $newPerformer = Performer::create([
            'name' => $request->name,
            'task_id' => $request->task_id,
        ]);
        if($newPerformer) {
            return response()->json(['status' => 200]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Performer  $performer
     * @return \Illuminate\Http\Response
     */
    public function show(Performer $performer)
    {
        return response()->json($performer);
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
        $newPerformer = Performer::find($id);
        $newPerformer->name = $request->name;
        $newPerformer->task_id = $request->task_id;
        if($newPerformer->save()) {
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
        $performer = Performer::find($id);
        if ($performer->delete()) {
            return response()->json(['status' => 200]);
        }
    }
}
