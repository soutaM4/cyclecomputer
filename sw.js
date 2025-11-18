// キャッシュ名とキャッシュ対象ファイルを定義
const CACHE_NAME = 'cycle-comp-v2'; 
const urlsToCache = [
    '/', 
    '/index.html',
    '/sw.js',
    '/manifest.json',
    '/apple-touch-icon.png' // 追加
    // '/icon-192x192.png', // 必要に応じて追加
    // '/icon-512x512.png'  // 必要に応じて追加
];

// インストールイベント: キャッシュを開き、リソースを追加
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting(); 
});

// フェッチイベント: リクエストに対し、キャッシュがあればキャッシュから応答
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// アクティベートイベント: 古いキャッシュを削除する
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});