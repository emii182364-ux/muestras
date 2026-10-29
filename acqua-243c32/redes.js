/* Acqua Detail · página de enlaces: botón «Compartir» (menú del celular o copiar el link). */
(() => {
  const b = document.getElementById('compartir'), t = document.getElementById('compartir-txt');
  if (!b) return;
  b.addEventListener('click', async () => {
    const datos = { title: 'Acqua Detail', text: 'Detailing y tratamientos cerámicos en Gualeguay', url: location.href };
    try {
      if (navigator.share) { await navigator.share(datos); return; }
      await navigator.clipboard.writeText(location.href);
      t.textContent = '¡Link copiado!';
      setTimeout(() => { t.textContent = 'Compartir esta página'; }, 2500);
    } catch (e) { /* la persona canceló */ }
  });
})();
