<?php

use App\Http\Controllers\Api\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    Route::get('/profile/{username}', [ProfileController::class, 'show']);

    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/suggested', [UserController::class, 'suggested']); 

    Route::apiResource('/posts', PostController::class);
    Route::post('/follow/{username}', [FollowController::class, 'follow']);
    Route::delete('/unfollow/{username}', [FollowController::class, 'unfollow']); 
    Route::get('/followers', [FollowController::class, 'followers']);
    Route::get('/following', [FollowController::class, 'following']);
    Route::get('/followers/{username}', [FollowController::class, 'userFollowers']); 
    Route::get('/following/{username}', [FollowController::class, 'userFollowing']); 
}); 