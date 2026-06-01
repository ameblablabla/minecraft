document.getElementById('download-version-1')?.addEventListener('click', () => {
  const url = window.OBSESSED_DOWNLOAD_URL;
  if (url) {
    window.open(url, '_blank');
  } else {
    alert('Ссылка для скачивания не задана. Откройте js/config.js и укажите OBSESSED_DOWNLOAD_URL.');
  }
});
