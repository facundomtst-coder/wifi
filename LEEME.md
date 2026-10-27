# WiFi QR para clientes

El cliente escanea la placa, deja su nombre y WhatsApp, ve la clave del WiFi (con un QR para pasársela a sus acompañantes) y tiene a mano los botones de reseña en Google, Instagram, WhatsApp y web. Cada contacto queda guardado en una planilla de Google.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `config.js` | **Lo único que hay que editar**: nombre del negocio, WiFi y enlaces |
| `index.html` | La página que ve el cliente |
| `placa.html` | La placa para imprimir con el QR |
| `apps_script.gs` | Código para la planilla de Google que guarda los teléfonos |

## 1. Cargar los datos del negocio

Abrí `config.js` con el Bloc de notas y completá los datos. Si querés logo, poné la imagen en esta carpeta como `logo.png` y escribí `logo: 'logo.png'`.

**Link de reseñas de Google:** en Google Business Profile, entrá a "Pedir reseñas" y copiá el enlace (`https://g.page/r/...`).

## 2. Planilla para guardar los teléfonos

1. Creá una planilla nueva en Google Sheets (por ejemplo "Clientes WiFi").
2. Menú **Extensiones → Apps Script**. Borrá lo que haya y pegá todo el contenido de `apps_script.gs`. Guardá.
3. **Implementar → Nueva implementación**. En el engranaje elegí **Aplicación web**.
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
4. Autorizá los permisos que pide Google (es tu propia cuenta).
5. Copiá la URL que termina en `/exec` y pegala en `config.js`, en `urlPlanilla`.

Cada cliente aparece en la pestaña **Clientes** con fecha, nombre, WhatsApp, si aceptó promociones y un link para abrirle el chat.

> Si después cambiás el código del script, hay que hacer **Implementar → Gestionar implementaciones → Editar → Nueva versión**. Si no, sigue corriendo el código viejo.

## 3. Publicar en GitHub Pages

1. Creá un repositorio nuevo en GitHub (por ejemplo `wifi`), público.
2. Subí `index.html`, `config.js`, `placa.html` (y `logo.png` si tenés). `apps_script.gs` y este LEEME no hace falta subirlos.
3. En el repositorio: **Settings → Pages → Branch: main / root → Save**.
4. A los minutos queda en `https://TU-USUARIO.github.io/wifi/`.

## 4. Imprimir la placa

1. Abrí `https://TU-USUARIO.github.io/wifi/placa.html`. La dirección ya viene cargada.
2. Escaneá el QR de la pantalla con tu celular y verificá que abra la página.
3. **Ctrl+P**, tamaño **A5**, márgenes **ninguno**. Se puede plastificar o mandar a imprimir en acrílico.

**Truco:** si tenés más de una placa (mostrador, mesas, vidriera), agregá al final de la dirección `?mesas` o `?vidriera`. Eso queda en la columna "Origen" de la planilla y te dice cuál se escanea más.

## Para tener en cuenta

- **La página no puede conectar el celular al WiFi sola.** Ni Android ni iPhone lo permiten desde una web. El cliente copia la clave con un toque. El QR de la clave sí conecta directo cuando lo escanea otro celular con la cámara.
- **Si cambiás la clave del WiFi**, actualizá `config.js` en GitHub. La placa no hace falta reimprimirla.
- **La clave está dentro del código de la página.** Alguien con conocimientos técnicos podría verla sin llenar el formulario. Para el WiFi de clientes de un comercio no es un problema, pero no uses la misma red ni la misma clave que la del sistema del negocio.
- **Datos personales:** el formulario pide permiso explícito para mandar promociones (Ley 25.326). Escribile solo a quienes tengan "Sí" en esa columna.
