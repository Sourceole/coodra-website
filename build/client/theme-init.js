(function () {
  try {
    var raw = localStorage.getItem('so_theme_last_v1') || '';
    var mode = String(raw).trim().toLowerCase() === 'dark' ? 'dark' : 'light';
    var bg = mode === 'dark' ? '#0b1220' : '#f4f5f7';
    document.documentElement.setAttribute('data-so-rc-theme', mode);
    document.documentElement.style.backgroundColor = bg;
    if (document.body) {
      document.body.setAttribute('data-so-rc-theme', mode);
      document.body.style.backgroundColor = bg;
    }
  } catch (_) {
    // no-op
  }
})();
