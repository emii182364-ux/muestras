/* Acqua Detail · configuración de la plantilla de turnos (demo). Horarios de ejemplo: a confirmar con Acqua. */
window.TURNOS_CONFIG = {
  modo: 'demo',
  negocio: { id: 'acqua-detail', nombre: 'Acqua Detail', whatsapp: '5493444510332', prefijoPais: '549', direccion: '25 de Mayo 1546, Gualeguay' },
  textos: { titulo: 'Reservá tu turno', prefijoPrecio: 'Estimativo promedio', campoVehiculo: 'Modelo del auto', ejemploVehiculo: 'Ej.: Toyota Hilux', lugar: 'taller', unidad: 'auto' },
  mostrarPrecios: true,
  puestos: ['Box 1', 'Box 2'],
  horarios: { 1: [['09:00', '13:00'], ['16:00', '20:00']], 2: [['09:00', '13:00'], ['16:00', '20:00']], 3: [['09:00', '13:00'], ['16:00', '20:00']],
              4: [['09:00', '13:00'], ['16:00', '20:00']], 5: [['09:00', '13:00'], ['16:00', '20:00']], 6: [['09:00', '13:00']] },
  cerrados: ['2026-11-20', '2026-12-08', '2026-12-25', '2027-01-01'],
  diasAdelante: 21,
  paso: 30,
  anticipacionMin: 120,
  preguntaExtra: { titulo: '¿Qué vehículo es?', corto: 'Vehículo', opciones: ['Auto', 'SUV', 'Camioneta'], nota: 'Los precios son un estimativo promedio para un auto mediano: en SUV y camionetas pueden variar.' },
  servicios: [
    { id: 'lavado-premium', nombre: 'Lavado premium', detalle: 'Limpieza profunda, descontaminación y brillo.', minutos: 120, precio: 25000 },
    { id: 'lavado-encerado', nombre: 'Lavado y encerado', detalle: 'Lavado premium más cera para un brillo profundo.', minutos: 180, precio: 40000 },
    { id: 'acrilico', nombre: 'Tratamiento acrílico', detalle: 'Pulido de corrección y sellado acrílico.', dias: 1, precio: 150000 },
    { id: 'ceramico', nombre: 'Tratamiento cerámico', detalle: 'Corrección de pintura y cerámico: 2 a 3 años de protección.', dias: 2, precio: 400000 },
    { id: 'interior', nombre: 'Detallado interior', detalle: 'Tapizados, alfombras y plásticos. Saca manchas.', minutos: 180 },
    { id: 'opticas', nombre: 'Restauración de ópticas', detalle: 'Ópticas opacas recuperan la claridad.', minutos: 90 }
  ],
  reservarUrl: 'turnos.html',
  agendaUrl: 'agenda.html'
};
