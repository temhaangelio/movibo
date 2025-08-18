<?php


use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\Admin\CommentController as AdminCommentController;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\NotificationController;

Route::get('noktaupdate', function () {
    $output = shell_exec('export PATH=$PATH:/usr/local/bin && sudo /var/www/movibo/update_project.sh 2>&1');

    dd($output);
});

// Ana sayfa - giriş yapmamış kullanıcılar için
Route::get('/', function () {
    if (auth()->check()) {
        // Giriş yapmış kullanıcıları ana sayfaya yönlendir
        return redirect()->route('home.authenticated');
    }

    return Inertia::render('Welcome');
})->name('welcome');

// Kullanım sözleşmesi sayfası
Route::get('/terms', function () {
    return Inertia::render('Terms');
})->name('terms');

// Giriş yapmış kullanıcılar için ana sayfa
Route::get('/home', function () {
    $user = auth()->user();

    // Takip edilen kullanıcıların ID'lerini al
    $followingIds = $user->following()->pluck('users.id')->toArray();
    $followingIds[] = $user->id; // Kendi paylaşımlarını da dahil et

    $posts = Post::with(['user', 'likes', 'comments'])
        ->whereIn('user_id', $followingIds)
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($post) {
            $post->is_liked = auth()->check() ? $post->isLikedBy(auth()->user()) : false;
            return $post;
        });

    return Inertia::render('user/AnaSayfa', [
        'posts' => $posts,
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->middleware('auth')->name('home.authenticated');



// Post rotaları
Route::middleware('auth')->group(function () {
    Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
    Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');
    Route::delete('/posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');
    Route::post('/posts/{post}/like', [LikeController::class, 'toggle'])->name('posts.like');
    Route::resource('comments', CommentController::class);



    // API routes
    Route::get('/api/search/movies', [ApiController::class, 'searchMovies'])->name('api.search.movies');
    Route::get('/api/search/books', [ApiController::class, 'searchBooks'])->name('api.search.books');
    Route::get('/api/search/users', [ApiController::class, 'searchUsers'])->name('api.search.users');
    Route::get('/api/posts/following', [ApiController::class, 'followingPosts'])->name('api.posts.following');
    Route::get('/api/posts/all', [ApiController::class, 'allPosts'])->name('api.posts.all');
    Route::get('/api/movies/popular', [MovieController::class, 'getPopularMovies'])->name('api.movies.popular');
    Route::get('/api/movies/{id}', [MovieController::class, 'getMovieDetails'])->name('api.movies.details');
    Route::get('/api/actors/{id}', [MovieController::class, 'getActorDetails'])->name('api.actors.details');

    // Follow routes
    Route::post('/users/{user}/follow', [FollowController::class, 'toggle'])->name('users.follow');
    Route::get('/users/{user}/followers', [FollowController::class, 'followers'])->name('users.followers');
    Route::get('/users/{user}/following', [FollowController::class, 'following'])->name('users.following');
    Route::get('/users/{user}/follow/check', [FollowController::class, 'check'])->name('users.follow.check');

    // Arama routes
    Route::get('/discover', function () {
        return Inertia::render('user/Arama');
    })->name('discover');
    Route::get('/api/discover/posts', [ApiController::class, 'discoverPosts'])->name('api.discover.posts');

    // Film detay sayfası
    Route::get('/movies/{id}', function ($id) {
        return Inertia::render('user/FilmDetay', [
            'id' => $id
        ]);
    })->name('movies.show');

    // Oyuncu detay sayfası
    Route::get('/actors/{id}', function ($id) {
        return Inertia::render('user/OyuncuDetay', [
            'id' => $id
        ]);
    })->name('actors.show');

    // Profil rotası
    Route::get('/profile', function () {
        $user = auth()->user();
        $posts = $user->posts()->with(['user', 'likes', 'comments'])->latest()->get();

        // User'ı privacy_settings ile birlikte yükle
        $user->load('followers', 'following');
        $user->followers_count = $user->followers()->count();
        $user->following_count = $user->following()->count();

        return Inertia::render('user/Profil', [
            'user' => $user,
            'posts' => $posts,
        ]);
    })->name('profile');

    // Başka kullanıcıların profillerini görüntüleme
    Route::get('/users/{user}', function (User $user) {
        $posts = $user->posts()->with(['user', 'likes', 'comments'])->latest()->get();

        // User'ı privacy_settings ile birlikte yükle
        $user->load('followers', 'following');
        $user->followers_count = $user->followers()->count();
        $user->following_count = $user->following()->count();

        return Inertia::render('user/Profil', [
            'user' => $user,
            'posts' => $posts,
        ]);
    })->name('users.show');

    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/photo', [ProfileController::class, 'updatePhoto'])->name('profile.photo');

    // Ayarlar rotası
    Route::get('/settings', function () {
        return Inertia::render('user/Ayarlar');
    })->name('settings');

    Route::patch('/settings', [ProfileController::class, 'updateSettings'])->name('settings.update');
    Route::patch('/settings/notifications', [ProfileController::class, 'updateNotifications'])->name('settings.notifications');
    Route::patch('/settings/privacy', [ProfileController::class, 'updatePrivacy'])->name('settings.privacy');
    Route::delete('/settings/delete-account', [ProfileController::class, 'deleteAccount'])->name('settings.delete-account');

    // Destek rotaları
Route::get('/support', [App\Http\Controllers\SupportController::class, 'index'])->name('support');
Route::post('/support', [App\Http\Controllers\SupportController::class, 'store'])->name('support.store');
Route::get('/api/support/tickets', [App\Http\Controllers\SupportController::class, 'getUserTickets'])->name('api.support.tickets');

// Bildirim rotaları
Route::get('/notifications', [App\Http\Controllers\NotificationController::class, 'index'])->name('notifications');
Route::post('/api/notifications/{notification}/mark-read', [App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.mark-read');
Route::post('/api/notifications/mark-all-read', [App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
Route::get('/api/notifications/unread-count', [App\Http\Controllers\NotificationController::class, 'getUnreadCount'])->name('notifications.unread-count');

// Rastgele film sayfası
Route::get('/rastgele', function () {
    return Inertia::render('user/Rastgele');
})->name('rastgele');

    // Yorum API routes
    Route::get('/api/posts/{post}/comments', [CommentController::class, 'getPostComments'])->name('api.posts.comments');
});



// Admin rotaları
Route::middleware(['auth', 'admin'])->prefix('panel')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    
    // Admin users routes - ID ile erişim için
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{id}', [UserController::class, 'show'])->name('users.show');
    Route::get('/users/{id}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update');
    Route::patch('/users/{id}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::patch('/users/{id}/toggle-block', [UserController::class, 'toggleBlock'])->name('users.toggle-block');
    Route::get('/users/{id}/activities', [UserController::class, 'activities'])->name('users.activities');
    Route::get('/activities', [UserController::class, 'allActivities'])->name('activities.index');
    
    Route::get('/posts', [AdminPostController::class, 'index'])->name('posts.index');
    Route::get('/posts/{post}', [AdminPostController::class, 'show'])->name('posts.show');
    Route::delete('/posts/{post}', [AdminPostController::class, 'destroy'])->name('posts.destroy');
    Route::resource('comments', AdminCommentController::class);
    
    // Admin destek rotaları
    Route::get('/support', [App\Http\Controllers\Admin\SupportController::class, 'index'])->name('support.index');
    Route::get('/support/{ticket}', [App\Http\Controllers\Admin\SupportController::class, 'show'])->name('support.show');
    Route::patch('/support/{ticket}', [App\Http\Controllers\Admin\SupportController::class, 'update'])->name('support.update');
    Route::delete('/support/{ticket}', [App\Http\Controllers\Admin\SupportController::class, 'destroy'])->name('support.destroy');
    Route::get('/destek', function () {
        // Örnek destek talepleri - gerçek uygulamada veritabanından gelecek
        $supportTickets = [
            [
                'id' => 1,
                'user' => [
                    'name' => 'Ahmet Yılmaz',
                    'email' => 'ahmet@example.com'
                ],
                'subject' => 'Hesap erişim sorunu',
                'message' => 'Hesabıma giriş yapamıyorum. Şifremi sıfırladım ama hala sorun yaşıyorum.',
                'status' => 'open',
                'created_at' => '2024-01-15T10:30:00Z',
                'replies_count' => 0
            ],
            [
                'id' => 2,
                'user' => [
                    'name' => 'Ayşe Demir',
                    'email' => 'ayse@example.com'
                ],
                'subject' => 'Video yükleme problemi',
                'message' => 'Film paylaşımı yaparken video yükleyemiyorum. Dosya boyutu 50MB ve MP4 formatında.',
                'status' => 'in_progress',
                'created_at' => '2024-01-14T15:45:00Z',
                'replies_count' => 2
            ],
            [
                'id' => 3,
                'user' => [
                    'name' => 'Mehmet Kaya',
                    'email' => 'mehmet@example.com'
                ],
                'subject' => 'Bildirim ayarları',
                'message' => 'Bildirim ayarlarını değiştirmek istiyorum ama ayarlar sayfasında bulamıyorum.',
                'status' => 'resolved',
                'created_at' => '2024-01-13T09:20:00Z',
                'replies_count' => 1
            ],
            [
                'id' => 4,
                'user' => [
                    'name' => 'Fatma Özkan',
                    'email' => 'fatma@example.com'
                ],
                'subject' => 'Takip sistemi sorunu',
                'message' => 'Kullanıcıları takip edebiliyorum ama takipçilerim listesinde görünmüyor.',
                'status' => 'open',
                'created_at' => '2024-01-12T14:15:00Z',
                'replies_count' => 0
            ]
        ];

        return Inertia::render('Admin/Destek/Index', [
            'supportTickets' => $supportTickets
        ]);
    })->name('destek');
    
    Route::get('/profile', function () {
        return Inertia::render('Admin/Profil/Index');
    })->name('profile');
    
    Route::patch('/profile', [ProfileController::class, 'updateAdmin'])->name('profile.update');
    Route::post('/profile/photo', [ProfileController::class, 'updatePhoto'])->name('profile.photo');
});

require __DIR__.'/auth.php';
