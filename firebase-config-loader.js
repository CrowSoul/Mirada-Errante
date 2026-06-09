(async function() {
  try {
    // Don't override if already present
    if (localStorage.getItem('firebaseConfig')) return;
    const res = await fetch('firebase-config.json', { cache: 'no-store' });
    if (!res.ok) return;
    const cfg = await res.json();
    if (cfg && typeof cfg === 'object') {
      localStorage.setItem('firebaseConfig', JSON.stringify(cfg));
      console.log('Firebase config loaded from firebase-config.json');
    }
  } catch (err) {
    // ignore - loader is optional
    console.debug('No firebase-config.json found or failed to load');
  }
})();
