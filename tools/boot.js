// The version label links to the repository.
{
  const a = document.createElement('a');
  a.href = 'https://github.com/SinaLaura/joseki-teacher';
  a.target = '_blank';
  a.rel = 'noopener';
  a.textContent = window.JOSEKI_VERSION || 'dev';
  document.getElementById('ver').appendChild(a);
}
window.addEventListener('resize', fit);
fit();
document.fonts && document.fonts.ready.then(() => {});
mount(document.getElementById('app'), Component);
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
