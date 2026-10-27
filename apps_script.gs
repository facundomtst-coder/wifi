// Archivo WiFi.gs dentro del proyecto de Apps Script de la planilla
// "Formulario sin título (respuestas)". Convive con Código.gs (el que pasa
// las respuestas del formulario a Contactos) y reusa su crearContacto().
//
// Implementar > Nueva implementación > Aplicación web
//   Ejecutar como: Yo   ·   Quién tiene acceso: Cualquier usuario
// Copiar la URL que termina en /exec y ponerla en config.js (urlPlanilla).

// Pestaña aparte para no mezclar con las respuestas del Formulario de Google
const HOJA_WIFI = 'WiFi';

function doPost(e) {
  const datos = JSON.parse(e.postData.contents);
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = libro.getSheetByName(HOJA_WIFI);
  if (!hoja) {
    hoja = libro.insertSheet(HOJA_WIFI);
    hoja.appendRow(['Fecha', 'Nombre', 'WhatsApp', 'Acepta promociones', 'Origen', 'Abrir chat']);
    hoja.setFrozenRows(1);
  }
  const nombre = String(datos.nombre || '').trim().slice(0, 80);
  const tel = String(datos.telefono || '').replace(/\D/g, '').replace(/^0/, '');
  const yaEstaba = telefonoRegistrado(hoja, tel);

  hoja.appendRow([
    new Date(),
    nombre,
    "'" + tel,                         // el apóstrofo evita que Sheets lo convierta en número
    datos.acepta ? 'Sí' : 'No',
    String(datos.origen || '').slice(0, 40),
    tel ? 'https://wa.me/' + normalizarAR(tel) : ''
  ]);

  // Igual que con el formulario: lo sumamos a Contactos de Google, una sola vez por teléfono
  if (tel && !yaEstaba) {
    try {
      crearContacto({ givenName: nombre, familyName: '', phone: tel, address: '', email: '', birthday: '', dni: '' });
    } catch (err) {
      Logger.log('Error creando contacto WiFi: ' + err);
    }
  }
  return ContentService.createTextOutput('ok');
}

function telefonoRegistrado(hoja, tel) {
  if (!tel || hoja.getLastRow() < 2) return false;
  const tels = hoja.getRange(2, 3, hoja.getLastRow() - 1, 1).getValues();
  return tels.some(fila => String(fila[0]).replace(/\D/g, '').replace(/^0/, '') === tel);
}

// Convierte "3624123456" al formato de wa.me para Argentina (549...).
// Si el cliente escribió el 15, el link puede fallar: revisar el número a mano.
function normalizarAR(tel) {
  if (tel.startsWith('549')) return tel;
  if (tel.startsWith('54')) return '549' + tel.slice(2);
  return '549' + tel;
}
