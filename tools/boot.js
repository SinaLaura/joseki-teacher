// Above the version label: the app label, linking to the owner's website. The version label links to the repository.
{
  const home = document.createElement('a');
  home.href = 'https://sinalaura.github.io/';
  home.target = '_blank';
  home.rel = 'noopener';
  home.textContent = 'ankabuti applications';
  document.getElementById('ver').appendChild(home);
  document.getElementById('ver').appendChild(document.createElement('br'));
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
