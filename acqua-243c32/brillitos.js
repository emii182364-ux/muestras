/* Acqua Detail · brillitos que caen (destellos de 4 puntas en celeste y blanco, como los reflejos de sus fotos).
   Un canvas fijo encima de todo, sin tocar clics. Se apaga con «reducir movimiento» y cuando la pestaña no se ve. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const lienzo = document.createElement('canvas');
  lienzo.className = 'brillitos';
  lienzo.setAttribute('aria-hidden', 'true');
  document.body.appendChild(lienzo);
  const ctx = lienzo.getContext('2d');
  const COLORES = ['255,255,255', '143,211,255', '63,178,255'];
  let ancho = 0, alto = 0, dpr = 1, chispas = [], ultimo = 0, corriendo = false;

  function nueva(arriba) {
    return {
      x: Math.random() * ancho,
      y: arriba ? -10 - Math.random() * alto * .3 : Math.random() * alto,
      r: 1.2 + Math.random() * 2.6,           // tamaño del destello
      v: 14 + Math.random() * 30,             // px por segundo, caen despacio
      deriva: (Math.random() - .5) * 12,      // se mecen un poco de costado
      fase: Math.random() * Math.PI * 2,
      titila: 1.5 + Math.random() * 2.5,
      color: COLORES[Math.random() * COLORES.length | 0]
    };
  }
  function medir() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    ancho = innerWidth; alto = innerHeight;
    lienzo.width = ancho * dpr; lienzo.height = alto * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cuantas = Math.round(Math.min(70, ancho * alto / 22000));
    while (chispas.length < cuantas) chispas.push(nueva(false));
    chispas.length = cuantas;
  }
  function destello(c, brillo) {
    const { x, y, r } = c;
    ctx.globalAlpha = brillo;
    // halo suave
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
    g.addColorStop(0, `rgba(${c.color},.55)`);
    g.addColorStop(1, `rgba(${c.color},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(x - r * 4, y - r * 4, r * 8, r * 8);
    // estrella de 4 puntas
    ctx.fillStyle = `rgb(${c.color})`;
    ctx.beginPath();
    ctx.moveTo(x, y - r * 3);
    ctx.quadraticCurveTo(x, y, x + r * 3, y);
    ctx.quadraticCurveTo(x, y, x, y + r * 3);
    ctx.quadraticCurveTo(x, y, x - r * 3, y);
    ctx.quadraticCurveTo(x, y, x, y - r * 3);
    ctx.fill();
  }
  function cuadro(t) {
    if (!corriendo) return;
    const dt = Math.min(.05, (t - (ultimo || t)) / 1000);
    ultimo = t;
    ctx.clearRect(0, 0, ancho, alto);
    for (let i = 0; i < chispas.length; i++) {
      const c = chispas[i];
      c.y += c.v * dt;
      c.x += Math.sin(t / 1000 + c.fase) * c.deriva * dt;
      if (c.y > alto + 10) chispas[i] = nueva(true);
      const brillo = .25 + .75 * Math.pow(Math.max(0, Math.sin(t / 1000 * c.titila + c.fase)), 3);
      destello(c, brillo);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(cuadro);
  }
  function arrancar() { if (corriendo) return; corriendo = true; ultimo = 0; requestAnimationFrame(cuadro); }
  function parar() { corriendo = false; }
  medir();
  addEventListener('resize', medir);
  document.addEventListener('visibilitychange', () => document.hidden ? parar() : arrancar());
  arrancar();
})();
