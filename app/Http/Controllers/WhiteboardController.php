<?php

namespace App\Http\Controllers;

use App\Models\Whiteboard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WhiteboardController extends Controller
{
    public function index()
    {
        // Get the user's personal whiteboards
        $myWhiteboards = Auth::user()->whiteboards()->latest()->get();

        // Get all public whiteboards, including the author's name
        $publicWhiteboards = Whiteboard::where('is_public', true)
            ->where('user_id', '!=', Auth::id()) // Optional: Exclude your own from the public tab
            ->with('user:id,name')
            ->latest()
            ->get();

        return Inertia::render('application/Whiteboard/Index', [
            'myWhiteboards' => $myWhiteboards,
            'publicWhiteboards' => $publicWhiteboards,
        ]);
    }

    public function store()
    {
        $whiteboard = Whiteboard::create([
            'user_id' => Auth::id(),
            'title' => 'Untitled Whiteboard',
        ]);
        return redirect()->route('whiteboards.show', $whiteboard);
    }

    public function show(Whiteboard $whiteboard)
    {
        if (!$whiteboard->is_public && $whiteboard->user_id !== Auth::id()) {
            abort(403, 'This whiteboard is private.');
        }
        $whiteboard->load('user:id,name'); // Load user name for display
        return Inertia::render('application/Whiteboard/Show', [
            'whiteboard' => $whiteboard,
        ]);
    }

    public function update(Request $request, Whiteboard $whiteboard)
    {
        if ($whiteboard->user_id !== Auth::id()) {
            abort(403);
        }
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'scene_data' => 'sometimes|nullable|array',
        ]);
        $whiteboard->update($validated);
        return response()->json(['message' => 'Saved'], 200);
    }

    public function togglePublic(Whiteboard $whiteboard)
    {
        if ($whiteboard->user_id !== Auth::id()) {
            abort(403);
        }

        $whiteboard->is_public = !$whiteboard->is_public;
        $whiteboard->save();

        return response()->json(['is_public' => $whiteboard->is_public]);
    }

    public function destroy(Whiteboard $whiteboard)
    {
        if ($whiteboard->user_id !== Auth::id()) {
            abort(403);
        }
        $whiteboard->delete();
        return redirect()->route('whiteboards.index')->with('message', 'Whiteboard deleted.');
    }
}
