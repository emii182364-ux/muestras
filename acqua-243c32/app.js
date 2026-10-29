/* Acqua Detail · muestra. Un solo archivo propio: mensajes de WhatsApp y comparador antes/después. */
(() => {
  const TEL = '5493444510332';

  // 1) Cada botón de WhatsApp llega con el servicio ya escrito (data-wa)
  document.querySelectorAll('a[data-wa]').forEach(a => {
    const wa = a.dataset.wa;
    const texto = wa === 'consulta'
      ? 'Hola Acqua Detail! Quiero hacer una consulta.'
      : wa.startsWith('un presupuesto')
        ? `Hola Acqua Detail! Quiero pedir ${wa}. Mi auto es: `
        : `Hola Acqua Detail! Quiero ${wa.startsWith('un') ? 'reservar ' + wa : 'consultar por ' + wa}.`;
    a.href = `https://wa.me/${TEL}?text=${encodeURIComponent(texto)}`;
  });

  // 2) Comparador antes/después (efecto «comparador-antes-despues» de la biblioteca, adaptado)
  const caja = document.getElementById('comparador');
  if (!caja) return;
  const rango = document.getElementById('rango');
  const ea = document.getElementById('etq-a'), ed = document.getElementById('etq-d');
  const antes = document.getElementById('img-antes'), despues = document.getElementById('img-despues');
  const PARES = {
    interior: { a: 'img/interior-antes.webp', d: 'img/interior-despues.webp', w: 476,
      altA: 'Antes: asientos de tela con manchas y suciedad', altD: 'Después: asientos limpios y parejos' },
    opticas: { a: 'img/opticas-antes.webp', d: 'img/opticas-despues.webp', w: 480,
      altA: 'Antes: óptica opaca y amarillenta', altD: 'Después: óptica transparente y brillante' }
  };
  function aplicar() {
    const p = +rango.value;
    caja.style.setProperty('--pos', p);
    rango.setAttribute('aria-valuetext', `${Math.round(100 - p)}% después`);
    ea.style.opacity = p < 18 ? 0 : 1;
    ed.style.opacity = p > 82 ? 0 : 1;
  }
  rango.addEventListener('input', aplicar);
  rango.addEventListener('keydown', e => {
    const paso = { ArrowLeft: -4, ArrowDown: -4, ArrowRight: 4, ArrowUp: 4, PageDown: -15, PageUp: 15, Home: -100, End: 100 }[e.key];
    if (paso === undefined) return;
    e.preventDefault();
    rango.value = Math.min(100, Math.max(0, +rango.value + paso));
    aplicar();
  });
  document.querySelectorAll('[data-par]').forEach(b => b.addEventListener('click', () => {
    const par = PARES[b.dataset.par];
    document.querySelectorAll('[data-par]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    antes.src = par.a; antes.alt = par.altA;
    despues.src = par.d; despues.alt = par.altD;
    rango.value = 50; aplicar();
  }));
  aplicar();
})();
