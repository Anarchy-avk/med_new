<?php

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


Route::get('/widget', 'WidgetController@index');
Route::get('/branch', 'WidgetController@getBranch');
Route::get('/specialties', 'WidgetController@getSpecialties');
Route::get('/datatm', 'WidgetController@getDataTime');
Route::get('/worker', 'WidgetController@getWorker');
Route::get('/pdf', 'WidgetController@generatePdf');
Route::get('/pdfdownload', 'WidgetController@generatePdfdownload');
Route::get('/qrcode', 'WidgetController@generate');
Route::post('/client', 'WidgetController@addClient');
Route::get('/cancel', 'WidgetController@cancel');
