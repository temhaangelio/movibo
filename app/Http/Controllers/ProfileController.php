<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Http\Requests\AdminProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Update the admin's profile information.
     */
    public function updateAdmin(AdminProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        // Sadece name ve email güncelle
        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // Şifre değişikliği varsa güncelle
        if (!empty($validated['password'])) {
            $user->password = bcrypt($validated['password']);
        }

        $user->save();

        return Redirect::back()->with('success', 'Profil başarıyla güncellendi!');
    }

    /**
     * Update the user's profile information.
     */
    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $request->user()->id . '|regex:/^[a-zA-Z0-9_]+$/',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,' . $request->user()->id,
            'notification_preferences' => 'nullable|array',
            'privacy_settings' => 'nullable|array',
        ]);

        $user = $request->user();
        $user->fill($validated);
        $user->save();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Profil bilgileri başarıyla güncellendi!'
            ]);
        }

        return Redirect::route('settings')->with('success', 'Ayarlar başarıyla güncellendi!');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Delete the user's account without password confirmation.
     */
    public function deleteAccount(Request $request): RedirectResponse
    {
        $user = $request->user();

        // Kullanıcının tüm verilerini sil
        $user->posts()->delete();
        $user->comments()->delete();
        $user->likes()->delete();
        $user->followers()->detach();
        $user->following()->detach();
        $user->notifications()->delete();
        $user->sentNotifications()->delete();

        // Profil fotoğrafını sil
        if ($user->profile_photo) {
            Storage::disk('public')->delete($user->profile_photo);
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/')->with('success', 'Hesabınız başarıyla silindi!');
    }

    /**
     * Update the user's notification preferences.
     */
    public function updateNotifications(Request $request)
    {
        $validated = $request->validate([
            'notification_preferences' => 'required|array',
            'notification_preferences.follow_notifications' => 'boolean',
            'notification_preferences.like_notifications' => 'boolean',
            'notification_preferences.comment_notifications' => 'boolean',
            'notification_preferences.email_notifications' => 'boolean',
        ]);

        $user = $request->user();
        $user->notification_preferences = $validated['notification_preferences'];
        $user->save();

        return back()->with('success', 'Bildirim ayarları güncellendi!');
    }

    /**
     * Update the user's privacy settings.
     */
    public function updatePrivacy(Request $request)
    {
        $validated = $request->validate([
            'privacy_settings' => 'required|array',
            'privacy_settings.profile_visibility' => 'required|in:public,private',
            'privacy_settings.show_email' => 'boolean',
            'privacy_settings.allow_follow_requests' => 'boolean',
        ]);

        $user = $request->user();
        $user->privacy_settings = $validated['privacy_settings'];
        $user->save();

        return back()->with('success', 'Gizlilik ayarları güncellendi!');
    }

    /**
     * Update the user's profile photo.
     */
    public function updatePhoto(Request $request)
    {
        try {
            // Debug için log ekle
            \Log::info('Profile photo upload started', [
                'user_id' => $request->user()->id,
                'has_file' => $request->hasFile('profile_photo'),
                'file_size' => $request->file('profile_photo') ? $request->file('profile_photo')->getSize() : null,
            ]);

            $request->validate([
                'profile_photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $user = $request->user();

            // Eski fotoğrafı sil
            if ($user->profile_photo) {
                Storage::disk('public')->delete($user->profile_photo);
            }

            // Yeni fotoğrafı yükle
            $path = $request->file('profile_photo')->store('profile-photos', 'public');
            
            $user->profile_photo = $path;
            $user->save();

            \Log::info('Profile photo upload successful', [
                'user_id' => $user->id,
                'path' => $path,
            ]);

            // Her zaman JSON response döndür
            return response()->json([
                'success' => true,
                'message' => 'Profil fotoğrafı başarıyla güncellendi!',
                'profile_photo' => $path,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Profile photo validation error', [
                'errors' => $e->errors(),
            ]);

            // Her zaman JSON response döndür
            return response()->json([
                'success' => false,
                'message' => 'Dosya formatı geçersiz. Lütfen JPEG, PNG, JPG veya GIF formatında bir dosya seçin.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Profile photo upload error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Her zaman JSON response döndür
            return response()->json([
                'success' => false,
                'message' => 'Fotoğraf yüklenirken bir hata oluştu: ' . $e->getMessage(),
            ], 500);
        }
    }
}
