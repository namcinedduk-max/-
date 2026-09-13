const CACHE_NAME = 'tteok-app-v3'; // v2 -> v3로 올려서 예전에 저장된 서비스워커를 확실히 갈아치움
self.addEventListener('install', e => {
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

// 네트워크 우선 (항상 최신 데이터) — 단, 구글시트(script.google.com)로 가는 요청은
// 아예 건드리지 않고 브라우저가 직접 처리하게 통과시킴.
// (예전엔 이 요청까지 가로채다가, 응답이 화면까지 제대로 안 넘어가서
//  "구글시트 불러오기/저장이 안 됨" 문제가 생겼음)
self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.indexOf('script.google.com') !== -1 || url.indexOf('script.googleusercontent.com') !== -1) {
    return; // respondWith 호출 안 함 = 서비스워커가 관여 안 하고 브라우저가 그대로 처리
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
