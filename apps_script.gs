// Pegar este código en la planilla de Google: Extensiones > Apps Script.
// Después: Implementar > Nueva implementación > Aplicación web
//   Ejecutar como: Yo   ·   Quién tiene acceso: Cualquier usuario
// Copiar la URL que termina en /exec y ponerla en config.js (urlPlanilla).

const HOJA = 'Clientes';

function doPost(e) {
  const datos = JSON.parse(e.postData.contents);
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = libro.getSheetByName(HOJA);
  if (!hoja) {
    hoja = libro.insertSheet(HOJA);
    hoja.appendRow(['Fecha', 'Nombre', 'WhatsApp', 'Acepta promociones', 'Origen', 'Abrir chat']);
    hoja.setFrozenRows(1);
  }
  const tel = String(datos.telefono || '').replace(/\D/g, '');
  hoja.appendRow([
    new Date(),
    String(datos.nombre || '').slice(0, 80),
    "'" + tel,                         // el apóstrofo evita que Sheets lo convierta en número
    datos.acepta ? 'Sí' : 'No',
    String(datos.origen || '').slice(0, 40),
    tel ? 'https://wa.me/' + normalizarAR(tel) : ''
  ]);
  return ContentService.createTextOutput('ok');
}

// Convierte "3624123456" o "03624123456" al formato de wa.me para Argentina (549...).
// Si el cliente escribió el 15, el link puede fallar: revisar el número a mano.
function normalizarAR(tel) {
  if (tel.startsWith('549')) return tel;
  if (tel.startsWith('54')) return '549' + tel.slice(2);
  tel = tel.replace(/^0/, '');
  return '549' + tel;
}
