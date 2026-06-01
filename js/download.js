document.getElementById('download-version-1')?.addEventListener('click', () => {
  const url = (window.OBSESSED_DOWNLOAD_URL || '').trim();
  if (!url) {
    alert(
      'Ссылка на архив ещё не настроена.\n\n' +
        'Откройте js/config.js в репозитории и укажите OBSESSED_DOWNLOAD_URL — прямую ссылку на .zip с .exe.'
    );
    return;
  }

  const a = document.createElement('a');
  a.href = url;
  a.rel = 'noopener';
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  a.remove();
});
