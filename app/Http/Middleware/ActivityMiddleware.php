<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\ActivityService;
use Symfony\Component\HttpFoundation\Response;

class ActivityMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Sadece giriş yapmış kullanıcılar için log tut
        if (Auth::check()) {
            $user = Auth::user();
            
            // Sayfa ziyaretini logla
            $this->logPageVisit($user, $request);
        }

        return $response;
    }

    /**
     * Sayfa ziyaretini logla
     */
    private function logPageVisit($user, Request $request): void
    {
        try {
            $path = $request->path();
            $method = $request->method();
            
            // Sadece GET isteklerini logla (sayfa ziyaretleri)
            if ($method === 'GET') {
                // Admin paneli sayfalarını logla
                if (str_starts_with($path, 'panel')) {
                    $pageName = $this->getPageName($path);
                    ActivityService::logPageVisit($user, $pageName, $request);
                }
                
                // Ana uygulama sayfalarını logla
                if (in_array($path, ['home', 'search', 'profile', 'notifications', 'settings'])) {
                    $pageName = $this->getPageName($path);
                    ActivityService::logPageVisit($user, $pageName, $request);
                }
            }
        } catch (\Exception $e) {
            // Log hatası olsa bile ana işlemi etkilemesin
            \Log::error('Activity logging failed in middleware', [
                'error' => $e->getMessage(),
                'user_id' => $user->id ?? 'unknown'
            ]);
        }
    }

    /**
     * Sayfa adını al
     */
    private function getPageName(string $path): string
    {
        $pageMap = [
            'panel' => 'Admin Dashboard',
            'panel/users' => 'Admin Users',
            'panel/posts' => 'Admin Posts',
            'panel/comments' => 'Admin Comments',
            'panel/destek' => 'Admin Support',
            'panel/profile' => 'Admin Profile',
            'home' => 'Ana Sayfa',
            'search' => 'Arama',
            'profile' => 'Profil',
            'notifications' => 'Bildirimler',
            'settings' => 'Ayarlar'
        ];

        foreach ($pageMap as $route => $name) {
            if (str_starts_with($path, $route)) {
                return $name;
            }
        }

        return ucfirst($path);
    }
}
