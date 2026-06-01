(function () {
  var path = location.pathname;
  var onGithubPages = /\.github\.io$/i.test(location.hostname);

  if (/\/vanilla\/?$/i.test(path) || /^\/vanilla\//i.test(path)) {
    location.replace(onGithubPages ? location.origin + '/minecraft/' : location.origin + '/');
    return;
  }

  try {
    localStorage.setItem('nuxt-color-mode', 'dark');
    localStorage.removeItem('i18n_redirected');
  } catch (_) {}
})();
