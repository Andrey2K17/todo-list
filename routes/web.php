<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::resource("/category", "CategoryController");
Route::resource("/task", "TaskController");
Route::resource("/performer", "PerformerController");
Route::resource("/performerAction", "PerformerActionController");
Route::get('/category/{category}/tasks', 'CategoryController@tasks');
Route::get('/task/{task}/performers', 'TaskController@performers');
Route::get('/task/{task}/performerActions', 'TaskController@performerActions');

