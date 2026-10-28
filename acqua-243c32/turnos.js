/* Plantilla de turnos · Páginas Clover (28/10/2026)
   Un solo archivo para las dos pantallas:
   - <body data-turnos="reservar">  → el cliente elige servicio, (vehículo), día y hora, y deja sus datos.
   - <body data-turnos="agenda">    → el negocio ve la semana por puesto, cambia estados y avisa por WhatsApp.
   Todo se configura en window.TURNOS_CONFIG (ver config.ejemplo.js). Sin dependencias ni código en línea (CSP estricta).
   Modo «demo»: los turnos se guardan en el navegador (localStorage) y se siembran turnos de ejemplo.
   Para la versión real solo hay que cambiar el objeto `almacen` por llamadas al servidor (ver RESUMEN.md). */
(() => {
  'use strict';
  const C = window.TURNOS_CONFIG;
  const modo = document.body.dataset.turnos;
  if (!C || !modo) return;

  /* ---------- utilidades ---------- */
  const h = (tag, attrs = {}, ...hijos) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const x of hijos.flat()) if (x != null && x !== false) el.append(x.nodeType ? x : document.createTextNode(x));
    return el;
  };
  const p2 = n => String(n).padStart(2, '0');
  const aMin = s => { const [a, b] = s.split(':').map(Number); return a * 60 + b; };
  const hhmm = m => `${p2(Math.floor(m / 60))}:${p2(m % 60)}`;
  const diaISO = d => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
  const medianoche = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const sumarDias = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const conMin = (d, m) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, m);
  const hora = d => hhmm(d.getHours() * 60 + d.getMinutes());
  const fmtCorto = new Intl.DateTimeFormat('es-AR', { weekday: 'short', day: 'numeric', month: 'short' });
  const fmtLargo = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  const fmtSemana = new Intl.DateTimeFormat('es-AR', { weekday: 'short' });
  const plata = n => '$' + Number(n).toLocaleString('es-AR');
  const T = Object.assign({
    titulo: 'Reservá tu turno',
    prefijoPrecio: '',
    campoVehiculo: 'Modelo',
    unidad: 'auto'
  }, C.textos || {});
  const PASO = C.paso || 30;
  const servicio = id => C.servicios.find(s => s.id === id) || { nombre: id };
  const duracion = s => s.dias ? `${s.dias} día${s.dias > 1 ? 's' : ''} en el taller`
    : [Math.floor(s.minutos / 60) && `${Math.floor(s.minutos / 60)} h`, s.minutos % 60 && `${s.minutos % 60} min`].filter(Boolean).join(' ');
  const wa = (num, texto) => `https://wa.me/${num}?text=${encodeURIComponent(texto)}`;
  const numWa = x => {
    let d = String(x || '').replace(/\D/g, '').replace(/^0/, '');
    const pre = C.negocio.prefijoPais || '';
    return d.startsWith(pre) ? d : pre + d;
  };

  /* ---------- horarios ---------- */
  function rangos(d) {
    if ((C.cerrados || []).includes(diaISO(d))) return [];
    return (C.horarios[d.getDay()] || []).map(([a, b]) => [aMin(a), aMin(b)]);
  }
  const abierto = d => rangos(d).length > 0;
  const jornada = d => { const r = rangos(d); return [conMin(d, r[0][0]), conMin(d, r[r.length - 1][1])]; };
  function diasAbiertos(desde, cuantos) {
    const out = []; let x = desde;
    for (let i = 0; out.length < cuantos && i < 60; i++, x = sumarDias(x, 1)) if (abierto(x)) out.push(x);
    return out.length === cuantos ? out : null;
  }

  /* ---------- almacén (en la versión real: llamadas al servidor) ---------- */
  const CLAVE = 'turnos:' + (C.negocio.id || C.negocio.nombre);
  const almacen = {
    leer() { try { return JSON.parse(localStorage.getItem(CLAVE)); } catch { return null; } },
    escribir(lista) { try { localStorage.setItem(CLAVE, JSON.stringify(lista)); } catch { /* sin almacenamiento: queda en memoria */ } },
    borrar() { try { localStorage.removeItem(CLAVE); } catch { /* nada */ } }
  };
  let memoria = null;
  function lista() {
    if (!memoria) {
      memoria = almacen.leer();
      if (!Array.isArray(memoria)) { memoria = []; sembrar(); almacen.escribir(memoria); }
    }
    return memoria;
  }
  const guardar = () => almacen.escribir(memoria);
  const activos = () => lista().filter(t => t.estado !== 'cancelado');

  /* ---------- disponibilidad ---------- */
  const libre = (puesto, ini, fin) => !activos().some(t => t.puesto === puesto && new Date(t.inicio) < fin && new Date(t.fin) > ini);
  const puestoLibre = (ini, fin) => C.puestos.find(p => libre(p, ini, fin));
  function opciones(serv, d, sinAnticipacion) {
    const limite = new Date(Date.now() + (sinAnticipacion ? -864e5 : (C.anticipacionMin || 0) * 6e4));
    const r = rangos(d);
    if (!r.length) return [];
    if (serv.dias) {
      const dias = diasAbiertos(d, serv.dias);
      if (!dias) return [];
      const ini = jornada(d)[0], fin = jornada(dias[dias.length - 1])[1];
      if (ini < limite) return [];
      const p = puestoLibre(ini, fin);
      return p ? [{ ini, fin, puesto: p }] : [];
    }
    const out = [];
    for (const [a, b] of r) for (let m = a; m + serv.minutos <= b; m += PASO) {
      const ini = conMin(d, m), fin = conMin(d, m + serv.minutos);
      if (ini < limite) continue;
      const p = puestoLibre(ini, fin);
      if (p) out.push({ ini, fin, puesto: p });
    }
    return out;
  }
  function crear(datos) {
    const t = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      creado: new Date().toISOString(), estado: 'confirmado',
      servicio: datos.servicio, extra: datos.extra || '', puesto: datos.op.puesto,
      inicio: datos.op.ini.toISOString(), fin: datos.op.fin.toISOString(),
      nombre: datos.nombre, telefono: datos.telefono, vehiculo: datos.vehiculo || '', nota: datos.nota || ''
    };
    lista().push(t); guardar();
    return t;
  }

  /* Turnos de ejemplo para la demo (nombres inventados) */
  function sembrar() {
    if (C.modo !== 'demo') return;
    const gente = C.demo?.clientes || [['Martín', 'VW Amarok'], ['Lucía', 'Fiat Cronos'], ['Carlos', 'Toyota Hilux'], ['Valeria', 'Peugeot 208'],
      ['Diego', 'Ford Ranger'], ['Sofía', 'Chevrolet Onix'], ['Pablo', 'Toyota Corolla'], ['Romina', 'Jeep Renegade'], ['Nicolás', 'VW Gol Trend']];
    const extras = C.preguntaExtra?.opciones || [''];
    const hoy = medianoche(new Date());
    let i = 0;
    for (let d = 0; d < 12 && i < gente.length; d++) {
      const dia = sumarDias(hoy, d);
      if (!abierto(dia)) continue;
      for (let k = 0; k < 2 && i < gente.length; k++, i++) {
        const serv = C.servicios[(i * 5 + d) % C.servicios.length];
        const ops = opciones(serv, dia, true);
        if (!ops.length) continue;
        const op = ops[Math.min(ops.length - 1, k * 4 + (i % 3))];
        const t = crear({ servicio: serv.id, extra: extras[i % extras.length], op, nombre: gente[i][0], telefono: '3444000000', vehiculo: gente[i][1] });
        if (d === 0) t.estado = k ? 'en-taller' : 'listo';
      }
    }
    memoria.forEach(t => { t.demo = true; });
  }

  /* ---------- calendario del cliente (.ics) ---------- */
  function descargarIcs(t) {
    const s = servicio(t.servicio), ini = new Date(t.inicio);
    const fin = s.dias ? new Date(ini.getTime() + 30 * 6e4) : new Date(t.fin);
    const f = d => `${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}T${p2(d.getHours())}${p2(d.getMinutes())}00`;
    const esc = x => String(x).replace(/[\\,;]/g, m => '\\' + m);
    const txt = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Paginas Clover//Turnos//ES', 'BEGIN:VEVENT',
      `UID:${t.id}@turnos`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(ini)}`, `DTEND:${f(fin)}`,
      `SUMMARY:${esc(s.nombre + ' · ' + C.negocio.nombre)}`, `LOCATION:${esc(C.negocio.direccion || '')}`,
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = h('a', { href: URL.createObjectURL(new Blob([txt], { type: 'text/calendar' })), download: 'turno.ics' });
    document.body.append(a); a.click(); a.remove();
  }

  const avisoDemo = () => C.modo === 'demo' && h('p', { class: 't-demo', role: 'note' },
    h('b', { text: 'Demo. ' }), 'Los turnos se guardan solo en este navegador. En la versión real, el negocio recibe el aviso al instante y el cliente, un recordatorio el día antes.');

  /* =================== PANTALLA RESERVAR =================== */
  function reservar(raiz) {
    const extra = C.preguntaExtra;
    const orden = ['servicio', ...(extra ? ['extra'] : []), 'cuando', 'datos'];
    const nombres = { servicio: 'Servicio', extra: extra?.corto || 'Vehículo', cuando: 'Día y hora', datos: 'Tus datos' };
    const st = { paso: 'servicio', dia: null };
    const sig = () => orden[orden.indexOf(st.paso) + 1];
    const ir = p => { st.paso = p; pintar(true); };

    function indicador() {
      if (st.paso === 'listo') return null;
      const actual = orden.indexOf(st.paso);
      return h('ol', { class: 't-indicador' }, orden.map((p, i) => {
        const hecho = i < actual;
        return h('li', { class: i === actual ? 'actual' : hecho ? 'hecho' : '' },
          hecho ? h('button', { type: 'button', onclick: () => ir(p) }, h('span', { text: i + 1 }), nombres[p])
                : h('span', { 'aria-current': i === actual ? 'step' : null }, h('span', { text: i + 1 }), nombres[p]));
      }));
    }
    function resumen() {
      const filas = [];
      if (st.serv && st.paso !== 'servicio') filas.push(st.serv.nombre);
      if (st.extra && orden.indexOf(st.paso) > orden.indexOf('extra')) filas.push(st.extra);
      if (st.op && st.paso === 'datos') filas.push(cuandoTexto(st.serv, st.op.ini, st.op.fin));
      return filas.length ? h('p', { class: 't-resumen' }, filas.join(' · ')) : null;
    }
    function cuandoTexto(s, ini, fin) {
      return s.dias ? `Lo dejás el ${fmtLargo.format(ini)} a las ${hora(ini)} · listo el ${fmtLargo.format(fin)}`
        : `${fmtLargo.format(ini)} a las ${hora(ini)}`;
    }

    const pasos = {
      servicio: () => [
        h('h2', { class: 't-h2', tabindex: '-1', text: '¿Qué le hacemos?' }),
        h('div', { class: 't-grilla' }, C.servicios.map(s => h('button', {
          type: 'button', class: 't-opcion' + (st.serv === s ? ' elegida' : ''), 'aria-pressed': String(st.serv === s),
          onclick: () => { st.serv = s; st.op = null; st.dia = null; ir(sig()); }
        },
          h('b', { text: s.nombre }),
          s.detalle && h('span', { class: 't-detalle', text: s.detalle }),
          h('span', { class: 't-meta' }, h('span', { text: duracion(s) }),
            C.mostrarPrecios && s.precio ? h('span', { class: 't-precio' }, T.prefijoPrecio && h('small', { text: T.prefijoPrecio + ' ' }), plata(s.precio)) : null)
        )))
      ],
      extra: () => [
        h('h2', { class: 't-h2', tabindex: '-1', text: extra.titulo }),
        h('div', { class: 't-grilla t-grilla-chica' }, extra.opciones.map(o => h('button', {
          type: 'button', class: 't-opcion' + (st.extra === o ? ' elegida' : ''), 'aria-pressed': String(st.extra === o),
          onclick: () => { st.extra = o; ir(sig()); }
        }, h('b', { text: o })))),
        extra.nota && h('p', { class: 't-nota', text: extra.nota })
      ],
      cuando: () => {
        const hoy = medianoche(new Date());
        const dias = [];
        for (let i = 0; i < (C.diasAdelante || 21); i++) {
          const d = sumarDias(hoy, i);
          dias.push({ d, ops: opciones(st.serv, d) });
        }
        if (!st.dia || !dias.find(x => +x.d === +st.dia && x.ops.length)) st.dia = (dias.find(x => x.ops.length) || {}).d;
        const elegido = dias.find(x => st.dia && +x.d === +st.dia);
        const ops = elegido ? elegido.ops : [];
        const tira = h('div', { class: 't-dias', role: 'group', 'aria-label': 'Elegí el día' }, dias.map(({ d, ops }) => h('button', {
          type: 'button', class: 't-dia' + (+d === +st.dia ? ' elegida' : ''), disabled: !ops.length,
          'aria-pressed': String(+d === +st.dia), 'aria-label': `${fmtLargo.format(d)}${ops.length ? '' : ', sin lugar'}`,
          onclick: () => { st.dia = d; pintar(false); }
        }, h('small', { text: fmtSemana.format(d).replace('.', '') }), h('b', { text: d.getDate() }),
          h('small', { text: !abierto(d) ? 'cerrado' : ops.length ? 'libre' : 'lleno' }))));
        let horas;
        if (!st.dia) horas = h('p', { class: 't-nota', text: 'No hay lugar en los próximos días. Escribinos por WhatsApp y lo coordinamos.' });
        else if (st.serv.dias) {
          const op = ops[0];
          horas = h('div', { class: 't-largo' },
            h('p', {}, 'Lo dejás el ', h('b', { text: `${fmtLargo.format(op.ini)} a las ${hora(op.ini)}` })),
            h('p', {}, 'Te lo entregamos el ', h('b', { text: `${fmtLargo.format(op.fin)} a las ${hora(op.fin)}` })),
            h('button', { type: 'button', class: 't-btn', onclick: () => { st.op = op; ir('datos'); } }, 'Elegir este día'));
        } else {
          const grupos = [['Mañana', o => o.ini.getHours() < 13], ['Tarde', o => o.ini.getHours() >= 13]];
          horas = h('div', {}, grupos.map(([titulo, f]) => {
            const g = ops.filter(f);
            return g.length ? h('div', { class: 't-franja' }, h('h3', { text: titulo }),
              h('div', { class: 't-horas' }, g.map(o => h('button', {
                type: 'button', class: 't-hora', onclick: () => { st.op = o; ir('datos'); }
              }, hora(o.ini))))) : null;
          }));
        }
        return [h('h2', { class: 't-h2', tabindex: '-1', text: '¿Cuándo te queda bien?' }), tira,
          st.dia && h('p', { class: 't-dia-elegido', text: fmtLargo.format(st.dia) }), horas];
      },
      datos: () => {
        const campo = (id, etiqueta, attrs) => h('label', { class: 't-campo', for: id }, h('span', { text: etiqueta }), h('input', Object.assign({ id, name: id }, attrs)));
        const form = h('form', {
          class: 't-form', novalidate: true, onsubmit: e => {
            e.preventDefault();
            if (!form.reportValidity()) return;
            const v = n => form.elements[n].value.trim();
            const op = st.op;
            if (!libre(op.puesto, op.ini, op.fin)) {
              const otro = puestoLibre(op.ini, op.fin);
              if (!otro) { alert('Ese horario se acaba de ocupar. Elegí otro, por favor.'); ir('cuando'); return; }
              op.puesto = otro;
            }
            st.turno = crear({ servicio: st.serv.id, extra: st.extra, op, nombre: v('nombre'), telefono: v('telefono'), vehiculo: v('vehiculo'), nota: v('nota') });
            ir('listo');
          }
        },
          campo('nombre', 'Tu nombre', { required: true, autocomplete: 'given-name', maxlength: 60 }),
          campo('telefono', 'Tu WhatsApp', { required: true, type: 'tel', inputmode: 'tel', autocomplete: 'tel', pattern: '[0-9 +\\(\\)\\-]{8,20}', placeholder: 'Ej.: 3444 51 0332' }),
          campo('vehiculo', T.campoVehiculo + ' (opcional)', { maxlength: 60, placeholder: C.textos?.ejemploVehiculo || '' }),
          h('label', { class: 't-campo', for: 'nota' }, h('span', { text: '¿Algo que debamos saber? (opcional)' }), h('textarea', { id: 'nota', name: 'nota', rows: 3, maxlength: 400 })),
          h('button', { type: 'submit', class: 't-btn' }, 'Confirmar turno'));
        return [h('h2', { class: 't-h2', tabindex: '-1', text: 'Tus datos' }),
          h('div', { class: 't-tarjeta-resumen' }, h('b', { text: st.serv.nombre }), st.extra && h('span', { text: st.extra }), h('span', { text: cuandoTexto(st.serv, st.op.ini, st.op.fin) })),
          form];
      },
      listo: () => {
        const t = st.turno, s = servicio(t.servicio), ini = new Date(t.inicio), fin = new Date(t.fin);
        const msj = `Hola ${C.negocio.nombre}! Reservé un turno desde la página: ${s.nombre}${t.extra ? ' (' + t.extra + ')' : ''}, ${cuandoTexto(s, ini, fin)}. Soy ${t.nombre}${t.vehiculo ? ', ' + t.vehiculo : ''}.`;
        return [h('div', { class: 't-listo' },
          h('div', { class: 't-check', 'aria-hidden': 'true' }),
          h('h2', { class: 't-h2', tabindex: '-1', text: '¡Turno reservado!' }),
          h('p', { class: 't-listo-cuando', text: cuandoTexto(s, ini, fin) }),
          h('p', { text: `${s.nombre}${t.extra ? ' · ' + t.extra : ''}${C.negocio.direccion ? ' · ' + C.negocio.direccion : ''}` }),
          h('div', { class: 't-acciones' },
            h('button', { type: 'button', class: 't-btn', onclick: () => descargarIcs(t) }, 'Agregar a mi calendario'),
            h('a', { class: 't-btn t-btn-borde', href: wa(C.negocio.whatsapp, msj) }, 'Avisar por WhatsApp')),
          h('p', { class: 't-nota' }, h('button', { type: 'button', class: 't-link', onclick: () => { Object.assign(st, { serv: null, extra: null, op: null, dia: null }); ir('servicio'); } }, 'Reservar otro turno'),
            C.agendaUrl && C.modo === 'demo' ? [' · ', h('a', { class: 't-link', href: C.agendaUrl, text: 'Ver cómo le llega al taller' })] : null))];
      }
    };

    function pintar(enfocar) {
      raiz.replaceChildren(
        h('h1', { class: 't-titulo', text: T.titulo }),
        indicador(), resumen(),
        h('section', { class: 't-paso', 'aria-live': 'polite' }, pasos[st.paso]()),
        st.paso !== 'servicio' && st.paso !== 'listo' ? h('button', { type: 'button', class: 't-link t-atras', onclick: () => ir(orden[orden.indexOf(st.paso) - 1]) }, '‹ Volver') : null,
        avisoDemo());
      if (enfocar) { raiz.querySelector('.t-h2')?.focus({ preventScroll: true }); raiz.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    }
    pintar(false);
  }

  /* =================== PANTALLA AGENDA =================== */
  function agenda(raiz) {
    const ESTADOS = { confirmado: 'Confirmado', 'en-taller': `En el ${C.textos?.lugar || 'taller'}`, listo: 'Listo', cancelado: 'Cancelado' };
    const lunesDe = d => { const x = medianoche(d); return sumarDias(x, -((x.getDay() + 6) % 7)); };
    let lunes = lunesDe(new Date());

    function tarjeta(t, dia) {
      const s = servicio(t.servicio), ini = new Date(t.inicio), fin = new Date(t.fin);
      let cuando = `${hora(ini)} – ${hora(fin)}`;
      if (s.dias) {
        const dias = diasAbiertos(medianoche(ini), s.dias) || [];
        const n = dias.findIndex(x => +x === +dia) + 1;
        cuando = n === 1 ? `Entra ${hora(ini)} · día 1 de ${s.dias}` : n === s.dias ? `Día ${n} de ${s.dias} · sale ${hora(fin)}` : `Día ${n} de ${s.dias}`;
      }
      const cambiar = e => { t.estado = e; guardar(); pintar(); };
      const num = numWa(t.telefono);
      const recordar = `Hola ${t.nombre}! Te recordamos tu turno en ${C.negocio.nombre}: ${s.nombre}, el ${fmtLargo.format(ini)} a las ${hora(ini)}.${C.negocio.direccion ? ' ' + C.negocio.direccion + '.' : ''} Si no podés venir, avisanos por acá.`;
      const listo = `Hola ${t.nombre}! Tu ${t.vehiculo || T.unidad} ya está listo en ${C.negocio.nombre}. Podés pasar a retirarlo cuando quieras.`;
      const idx = C.puestos.indexOf(t.puesto);
      return h('article', { class: `a-turno a-${t.estado} a-p${idx % 4}` },
        h('p', { class: 'a-cuando', text: cuando }),
        h('h3', { text: s.nombre }),
        h('p', { class: 'a-cliente', text: [t.nombre, t.vehiculo, t.extra].filter(Boolean).join(' · ') }),
        t.nota && h('p', { class: 'a-nota', text: t.nota }),
        h('p', { class: 'a-chips' }, h('span', { class: 'a-puesto', text: t.puesto }), h('span', { class: 'a-estado', text: ESTADOS[t.estado] })),
        t.estado !== 'cancelado' && h('div', { class: 'a-acciones' },
          t.estado === 'confirmado' && h('button', { type: 'button', onclick: () => cambiar('en-taller') }, 'Llegó'),
          t.estado === 'en-taller' && h('button', { type: 'button', onclick: () => cambiar('listo') }, 'Marcar listo'),
          t.estado === 'confirmado' && h('a', { href: wa(num, recordar) }, 'Recordar'),
          t.estado === 'listo' && h('a', { href: wa(num, listo) }, 'Avisar que está listo'),
          t.estado !== 'listo' && h('button', { type: 'button', class: 'a-cancelar', 'aria-label': `Cancelar turno de ${t.nombre}`, onclick: () => { if (confirm(`¿Cancelar el turno de ${t.nombre}?`)) cambiar('cancelado'); } }, 'Cancelar')));
    }

    function pintar() {
      const dias = Array.from({ length: 7 }, (_, i) => sumarDias(lunes, i));
      const finSemana = sumarDias(lunes, 7);
      const deLaSemana = lista().filter(t => new Date(t.inicio) < finSemana && new Date(t.fin) > lunes);
      const vivos = deLaSemana.filter(t => t.estado !== 'cancelado');
      const empiezan = vivos.filter(t => new Date(t.inicio) >= lunes);
      const ingreso = empiezan.reduce((a, t) => a + (servicio(t.servicio).precio || 0), 0);
      const hoy = +medianoche(new Date());
      raiz.replaceChildren(
        h('div', { class: 'a-cabeza' },
          h('h1', { class: 't-titulo', text: 'Agenda de trabajo' }),
          h('div', { class: 'a-nav' },
            h('button', { type: 'button', 'aria-label': 'Semana anterior', onclick: () => { lunes = sumarDias(lunes, -7); pintar(); } }, '‹'),
            h('button', { type: 'button', onclick: () => { lunes = lunesDe(new Date()); pintar(); } }, 'Hoy'),
            h('button', { type: 'button', 'aria-label': 'Semana siguiente', onclick: () => { lunes = sumarDias(lunes, 7); pintar(); } }, '›')),
          h('p', { class: 'a-rango', text: `Semana del ${fmtCorto.format(lunes)} al ${fmtCorto.format(sumarDias(lunes, 6))}` })),
        h('div', { class: 'a-numeros' },
          h('p', {}, h('b', { text: empiezan.length }), 'turnos nuevos'),
          h('p', {}, h('b', { text: vivos.filter(t => t.estado === 'en-taller').length }), `en el ${C.textos?.lugar || 'taller'}`),
          h('p', {}, h('b', { text: vivos.filter(t => t.estado === 'listo').length }), 'listos'),
          C.mostrarPrecios ? h('p', {}, h('b', { text: plata(ingreso) }), 'estimado') : null),
        h('p', { class: 'a-leyenda' }, C.puestos.map((p, i) => h('span', { class: `a-p${i % 4}`, text: p })),
          C.reservarUrl ? h('a', { class: 't-btn a-nuevo', href: C.reservarUrl }, '+ Nuevo turno') : null),
        h('div', { class: 'a-semana' }, dias.map(d => {
          const finDia = sumarDias(d, 1);
          const delDia = abierto(d) ? deLaSemana.filter(t => new Date(t.inicio) < finDia && new Date(t.fin) > d)
            .sort((a, b) => new Date(a.inicio) - new Date(b.inicio)) : [];
          return h('section', { class: 'a-dia' + (+d === hoy ? ' a-hoy' : '') + (abierto(d) ? '' : ' a-cerrado'), 'aria-label': fmtLargo.format(d) },
            h('h2', {}, h('span', { text: fmtSemana.format(d).replace('.', '') }), h('b', { text: d.getDate() }), +d === hoy ? h('small', { text: 'hoy' }) : null),
            !abierto(d) ? h('p', { class: 'a-vacio', text: 'Cerrado' })
              : delDia.length ? delDia.map(t => tarjeta(t, d)) : h('p', { class: 'a-vacio', text: 'Sin turnos' }));
        })),
        C.modo === 'demo' ? h('p', { class: 't-nota a-reiniciar' }, h('button', {
          type: 'button', class: 't-link', onclick: () => { almacen.borrar(); memoria = null; pintar(); }
        }, 'Reiniciar la demo')) : null,
        avisoDemo());
    }
    pintar();
  }

  const raiz = document.getElementById('turnos');
  if (!raiz) return;
  if (modo === 'reservar') reservar(raiz);
  else if (modo === 'agenda') agenda(raiz);
})();
