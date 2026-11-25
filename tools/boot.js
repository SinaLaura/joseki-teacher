document.getElementById('ver').textContent = window.JOSEKI_VERSION || 'dev';
window.addEventListener('resize', fit);
fit();
document.fonts && document.fonts.ready.then(() => {});
mount(document.getElementById('app'), Component);
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
