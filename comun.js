// Partes compartidas por las páginas (WiFi y número del local).
// Cada página llama a iniciarPagina() con lo que la hace distinta.

const C = window.CONFIG;
// Misma clave para todas las páginas: quien ya dejó sus datos no los vuelve a cargar
const LS_KEY = 'wifi-registrado-v1';

const ICONOS = {
  resena: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.8-1.1-4.6-4-4.8-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/></svg>',
  web: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/></svg>',
  telefono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 005 5L15 12l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z"/></svg>',
  contacto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0114 0M19 8v6M16 11h6"/></svg>'
};

function urlWhatsapp() {
  return C.enlaces.whatsapp ? 'https://wa.me/' + C.enlaces.whatsapp.replace(/\D/g, '') : '';
}

function crearBoton(icono, texto, url, clase) {
  const a = document.createElement('a');
  a.className = 'btn' + (clase ? ' ' + clase : '');
  a.href = url;
  if (/^https?:/.test(url)) { a.target = '_blank'; a.rel = 'noopener'; }
  a.innerHTML = ICONOS[icono] + '<span></span>';
  a.querySelector('span').textContent = texto;
  return a;
}

function armarCabecera(tituloPestana) {
  document.title = tituloPestana + ' · ' + C.negocio;
  document.getElementById('nombre-negocio').textContent = C.negocio;
  document.getElementById('texto-acepta').textContent =
    'Acepto que ' + C.negocio + ' me escriba por WhatsApp con novedades y promociones.';
  document.getElementById('pie').textContent = C.negocio + (C.direccion ? ' · ' + C.direccion : '');
  const logo = document.getElementById('logo');
  if (C.logo) {
    logo.innerHTML = '<img class="logo">';
    logo.firstChild.src = C.logo;
    logo.firstChild.alt = C.negocio;
    // El logo ya trae el nombre, no lo repetimos
    document.getElementById('nombre-negocio').hidden = true;
  } else {
    logo.innerHTML = '<div class="logo-letra"></div>';
    logo.firstChild.textContent = C.negocio.trim().charAt(0).toUpperCase();
  }
}

function armarEnlaces(incluirWhatsapp) {
  const enlaces = [
    { icono: 'resena', texto: 'Dejanos tu reseña en Google', url: C.enlaces.resenaGoogle, clase: 'destacado' },
    { icono: 'instagram', texto: 'Seguinos en Instagram', url: C.enlaces.instagram },
    { icono: 'whatsapp', texto: 'Escribinos por WhatsApp', url: incluirWhatsapp && urlWhatsapp() },
    { icono: 'web', texto: 'Visitá nuestra web', url: C.enlaces.web }
  ];
  const links = document.getElementById('links');
  for (const e of enlaces) {
    if (e.url) links.appendChild(crearBoton(e.icono, e.texto, e.url, e.clase));
  }
}

async function copiar(boton, valor) {
  try { await navigator.clipboard.writeText(valor); } catch (_) {
    const t = document.createElement('textarea');
    t.value = valor; document.body.appendChild(t); t.select();
    document.execCommand('copy'); t.remove();
  }
  const texto = boton.textContent;
  boton.textContent = '¡Copiado!'; boton.classList.add('copiado');
  setTimeout(() => { boton.textContent = texto; boton.classList.remove('copiado'); }, 1800);
}

function yaRegistrado() {
  try { return localStorage.getItem(LS_KEY) === '1'; } catch (_) { return false; }
}
function marcarRegistrado() {
  try { localStorage.setItem(LS_KEY, '1'); } catch (_) {}
}

// opciones: { titulo, origen, incluirWhatsapp, mostrar }
//   origen: lo que queda en la columna "Origen" de la planilla
//   mostrar: arma el paso 2 (lo que el cliente recibe a cambio de sus datos)
function iniciarPagina(opciones) {
  armarCabecera(opciones.titulo);
  armarEnlaces(opciones.incluirWhatsapp);

  function revelar() {
    document.getElementById('paso-form').hidden = true;
    document.getElementById('paso-2').hidden = false;
    document.getElementById('links').hidden = false;
    opciones.mostrar();
  }

  document.getElementById('form').addEventListener('submit', async ev => {
    ev.preventDefault();
    const nombre = document.getElementById('f-nombre').value.trim();
    const tel = document.getElementById('f-tel').value.replace(/[^\d+]/g, '');
    const acepta = document.getElementById('f-acepta').checked;
    const error = document.getElementById('error');
    error.textContent = '';
    if (nombre.length < 2) { error.textContent = 'Escribí tu nombre.'; return; }
    if (tel.replace(/\D/g, '').length < 8) { error.textContent = 'Revisá el número de WhatsApp.'; return; }

    const btn = document.getElementById('btn-enviar');
    btn.disabled = true; btn.textContent = 'Un segundo…';
    if (C.urlPlanilla) {
      const extra = location.search.slice(1);
      try {
        // text/plain evita el "preflight" CORS que Apps Script no responde
        await fetch(C.urlPlanilla, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ nombre, telefono: tel, acepta, origen: opciones.origen + (extra ? '-' + extra : '') })
        });
      } catch (_) {
        // Si falla la red igual le damos lo que pidió: el cliente no tiene la culpa
      }
    }
    marcarRegistrado();
    revelar();
  });

  if (yaRegistrado()) revelar();
}
