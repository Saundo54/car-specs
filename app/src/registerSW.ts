if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const response = await fetch('/sw.js', { method: 'HEAD' });
      const contentType = response.headers.get('content-type') || '';

      if (!response.ok || !contentType.includes('javascript')) {
        console.info('Skipping service worker registration: /sw.js not available.');
        return;
      }

      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered with scope:', registration.scope);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  });
}
