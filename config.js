// ============================================================
//  DATOS DEL NEGOCIO — es lo único que hay que editar
// ============================================================
window.CONFIG = {
  negocio: 'Facundo MT',
  direccion: 'Diagonal Eva Perón 251',   // opcional, sale al pie
  logo: 'logo.jpg',                      // opcional: imagen en la misma carpeta

  // Dirección publicada: es la que va en el QR de la placa
  urlPagina: 'https://facundomtst-coder.github.io/wifi/',

  wifi: {
    red: 'Cerveza Schneider 2.4GHz',
    clave: 'hasar1978',
    seguridad: 'WPA'          // 'WPA' (casi siempre), 'WEP' o 'nopass' si no tiene clave
  },

  enlaces: {                  // dejá '' los que no uses y no aparecen
    resenaGoogle: 'https://g.page/r/CbQLvnOwBd3OEBM/review',
    instagram: 'https://www.instagram.com/facundomt.st/',
    whatsapp: '5493624168183',             // número con código de país, sin 0 ni 15
    web: 'https://www.facundomt.com.ar'
  },

  // URL de la aplicación web de Google Apps Script (ver LEEME.md).
  // Mientras esté vacía, la página funciona pero no guarda los teléfonos.
  urlPlanilla: 'https://script.google.com/macros/s/AKfycbyt6SDNn-YX2w3RNCUmbGuhQnF05tkEoQo1PSLzJkJcr_DmJ48VjMclN2gCuvmDsyJiNQ/exec'
};
