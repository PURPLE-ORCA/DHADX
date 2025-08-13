<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CertificateController extends Controller
{
    public function index()
    {
        $certificates = Certificate::with('user')->latest()->get();
        $users = User::all();
        return Inertia::render('application/Certificate/Index', [
            'certificates' => $certificates,
            'users' => $users,
        ]);
    }

    public function create()
    {
        $users = User::all();
        return Inertia::render('application/Certificate/Create', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('certificates', 'public');
        }

        $user = User::findOrFail($request->user_id);
        $code = $this->generateUniqueCertificateCode($user);

        Certificate::create([
            'user_id' => $request->user_id,
            'code' => $code,
            'image' => $imagePath,
        ]);

        return redirect()->route('certificates.index')->with('success', 'Certificate created successfully.');
    }

    public function showVerificationForm()
    {
        return Inertia::render('Application/Certificate/Verify');
    }

    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|string|exists:certificates,code',
        ]);

        $certificate = Certificate::with('user')->where('code', $request->code)->first();

        return Inertia::render('Application/Certificate/Verify', [
            'certificate' => $certificate,
        ]);
    }

    private function generateUniqueCertificateCode(User $user): string
    {
        $nameParts = explode(' ', $user->name);
        $firstName = $nameParts[0];
        $lastName = count($nameParts) > 1 ? end($nameParts) : '';
        $initials = Str::upper(Str::substr($firstName, 0, 1) . Str::substr($lastName, 0, 1));
        $year = date('y');
        $code = '';
        do {
            $randomNumber = Str::padLeft(rand(1, 9999), 4, '0');
            $code = "{$initials}-{$randomNumber}-{$year}";
        } while (Certificate::where('code', $code)->exists());

        return $code;
    }
}
