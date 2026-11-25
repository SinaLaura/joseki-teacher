// The version label links to the repository.
{
  const a = document.createElement('a');
  a.href = 'https://github.com/SinaLaura/joseki-teacher';
  a.target = '_blank';
  a.rel = 'noopener';
  a.textContent = window.JOSEKI_VERSION || 'dev';
  document.getElementById('ver').appendChild(a);
}
// Full screen on phones: hides Android's status and navigation bar, also in a browser tab and before
// Chrome has picked up the manifest's "fullscreen". Browsers only allow this after a tap, so ask on each
// tap while not in full screen (swiping the bars back in leaves full screen). iPhones don't support it.
document.addEventListener('pointerup', () => {
  const el = document.documentElement;
  if (!matchMedia('(pointer: coarse)').matches || document.fullscreenElement || !el.requestFullscreen) return;
  el.requestFullscreen({ navigationUI: 'hide' }).catch(() => {});
});
window.addEventListener('resize', fit);
fit();
document.fonts && document.fonts.ready.then(() => {});
mount(document.getElementById('app'), Component);
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
