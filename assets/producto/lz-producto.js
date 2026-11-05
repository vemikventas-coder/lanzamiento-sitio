/* LANZAMIENTO · Fichas nativas de Webador con el diseño LZ.
   Se carga en todo el sitio desde «Ajustes → Avanzado → Código HTML» (ver codigoGlobal), pero solo actúa
   en /product/... (body.jw-is-segment-product): pone el encabezado, el menú y el pie de LANZAMIENTO,
   la ruta Tienda / Línea / Modelo y el aviso de venta, y deja la ficha nativa (precio, versiones, fotos) intacta. */
(function (raiz) {
  'use strict';
  var BASE_POR_DEFECTO = 'https://vemikventas-coder.github.io/lanzamiento-sitio/';
  /* Tipo de producto (prefijo del nombre en Webador) → línea de la tienda. Igual que build/fichas-webador.mjs */
  var TIPOS = [
    ['Mueble de baño', 'Muebles de baño'], ['Espejo LED', 'Espejos LED'], ['Lavabo', 'Lavabos'],
    ['Monomando', 'Grifería'], ['Llave para tarja', 'Grifería'], ['Fregadero', 'Cocina'],
    ['Contra', 'Accesorios'], ['Coladera', 'Accesorios'], ['Cortina para baño', 'Accesorios'], ['Malla decorativa', 'Accesorios']
  ].sort(function (a, b) { return b[0].length - a[0].length; });
  var SECCIONES = [['/disena-tu-bano', 'Diseña tu baño'], ['/porcelanato', 'Porcelanato'], ['/calculadora', 'Calculadora'], ['/tienda', 'Tienda'], ['/profesionales', 'Profesionales']];

  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  function esFicha(clases) { return /(^|\s)jw-is-segment-product(\s|$)/.test(String(clases || '')); }

  function partirTitulo(titulo) {
    var t = String(titulo || '').trim();
    for (var i = 0; i < TIPOS.length; i++) {
      var tipo = TIPOS[i][0];
      if (t.indexOf(tipo + ' ') === 0) return { tipo: tipo, modelo: t.slice(tipo.length + 1).trim(), linea: TIPOS[i][1] };
    }
    return { tipo: '', modelo: t, linea: null };
  }

  function enlaceLinea(linea) { return linea ? '/tienda?linea=' + encodeURIComponent(linea) : '/tienda'; }

  function enlaces(conInicio) {
    return (conInicio ? [['/', 'Inicio']] : []).concat(SECCIONES).map(function (s) {
      return '<a href="' + s[0] + '"' + (s[0] === '/tienda' ? ' aria-current="page"' : '') + '>' + esc(s[1]) + '</a>';
    }).join('');
  }

  function encabezadoHTML(base) {
    return '<header class="lzp-hdr"><a class="lzp-logo" href="/"><img src="' + esc(base) + 'assets/marca/logo-lz-marfil.png" alt="LANZAMIENTO · inicio" width="120" height="40"></a>' +
      '<nav class="lzp-nav" aria-label="Principal">' + enlaces(false) + '</nav>' +
      '<button class="lzp-menu-btn" type="button" aria-expanded="false" aria-controls="lzp-menu">Menú</button></header>' +
      '<nav class="lzp-menu" id="lzp-menu" aria-label="Menú" hidden>' + enlaces(true) + '</nav>';
  }

  function pieHTML(base) {
    return '<footer class="lzp-pie"><div class="lzp-pie-top">' +
      '<div><img src="' + esc(base) + 'assets/marca/logo-lz-marfil.png" alt="LANZAMIENTO" width="162" height="54" loading="lazy"></div>' +
      '<div><h6>Tienda</h6><ul><li><a href="/tienda">Todos los productos</a></li><li><a href="' + enlaceLinea('Muebles de baño') + '">Muebles de baño</a></li><li><a href="/porcelanato">Porcelanato</a></li></ul></div>' +
      '<div><h6>Herramientas</h6><ul><li><a href="/disena-tu-bano">Diseña tu baño</a></li><li><a href="/calculadora">Calculadora de cajas</a></li></ul></div>' +
      '<div><h6>Profesionales</h6><ul><li><a href="/profesionales">Arquitectos y obra</a></li><li><a href="/porcelanato">Fichas técnicas</a></li></ul></div>' +
      '</div><div class="lzp-pie-base"><span>LANZAMIENTO · ' + new Date().getFullYear() + '</span><span>Precios con IVA incluido.</span></div></footer>';
  }

  function avisoVenta(hayBoton) {
    return hayBoton ? '' : '<p class="lzp-aviso"><b>Venta en línea próximamente</b> · Precio con IVA incluido</p>';
  }

  /* Las 6 páginas con bloque LZ: se marcan en el <head>, antes de pintar, para que no se vea la plantilla ni la carga */
  var RUTAS_LZ = /^\/(disena-tu-bano|porcelanato|calculadora|tienda|profesionales)?\/?$/;
  var EDITOR_HOST = /^www\.webador\./i, EDITOR_RUTA = /^\/v2\//;
  function esPaginaLZ(ruta, host) {
    if (EDITOR_HOST.test(host || '') || EDITOR_RUTA.test(ruta || '')) return false;
    return RUTAS_LZ.test(ruta || '/');
  }

  function codigoGlobal(base) {
    var critico = '<style>html.lz-pagina,html.lz-pagina body{background:#0d0c0b!important}html.lz-pagina body{visibility:hidden}' +
      'html.lz-pagina #lz-sitio{visibility:visible;position:fixed!important;inset:0!important;z-index:2147483000!important}</style>';
    var marca = '<script>(function(){var h=location.hostname,r=location.pathname;if(/' + EDITOR_HOST.source + '/i.test(h)||/' + EDITOR_RUTA.source + '/.test(r)||!/' + RUTAS_LZ.source + '/.test(r))return;' +
      'var d=document.documentElement;d.classList.add("lz-pagina");var q=function(){if(!document.getElementById("lz-sitio"))d.classList.remove("lz-pagina")};' +
      'document.addEventListener("DOMContentLoaded",q);setTimeout(q,4000)})();</script>';
    return critico + marca + '<link rel="stylesheet" href="' + base + 'assets/fuentes/fuentes.css">' +
      '<link rel="stylesheet" href="' + base + 'assets/producto/lz-producto.css">' +
      '<script src="' + base + 'assets/producto/lz-producto.js" defer></script>';
  }

  var api = { TIPOS: TIPOS, esFicha: esFicha, esPaginaLZ: esPaginaLZ, partirTitulo: partirTitulo, enlaceLinea: enlaceLinea, encabezadoHTML: encabezadoHTML, pieHTML: pieHTML, avisoVenta: avisoVenta, codigoGlobal: codigoGlobal };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; return; }
  raiz.LZ = raiz.LZ || {}; raiz.LZ.producto = api;

  /* ---------- En la ficha ---------- */
  var doc = raiz.document, guion = doc.currentScript;
  var base = (guion && guion.src && guion.src.replace(/assets\/producto\/lz-producto\.js.*$/, '')) || BASE_POR_DEFECTO;

  function montar() {
    if (!esFicha(doc.body && doc.body.className) || doc.querySelector('.lzp-hdr')) return;
    var salto = doc.querySelector('.jw-skip-link');
    (salto || doc.body.firstChild) && (salto ? salto.insertAdjacentHTML('afterend', encabezadoHTML(base)) : doc.body.insertAdjacentHTML('afterbegin', encabezadoHTML(base)));
    var btn = doc.querySelector('.lzp-menu-btn'), panel = doc.getElementById('lzp-menu');
    btn.addEventListener('click', function () { var abrir = panel.hidden; panel.hidden = !abrir; btn.setAttribute('aria-expanded', String(abrir)); btn.textContent = abrir ? 'Cerrar' : 'Menú'; });

    var ficha = doc.querySelector('.product-page'), h1 = doc.querySelector('.product-page__heading');
    if (ficha && h1) {
      var t = partirTitulo(h1.textContent);
      if (t.tipo) h1.innerHTML = '<span class="lzp-tipo">' + esc(t.tipo) + '</span> <span class="lzp-modelo">' + esc(t.modelo) + '</span>';
      ficha.insertAdjacentHTML('beforebegin', '<nav class="lzp-miga" aria-label="Ruta"><a href="/tienda">Tienda</a><span>/</span>' +
        (t.linea ? '<a href="' + enlaceLinea(t.linea) + '">' + esc(t.linea) + '</a><span>/</span>' : '') + '<b>' + esc(t.modelo) + '</b></nav>');
      /* El aviso va después del selector de versión (si lo hay) o del precio */
      var ancla = doc.querySelector('.product-page__customization-container') || doc.querySelector('.product-page__price-container');
      var aviso = avisoVenta(!!doc.querySelector('.js-product-container__button'));
      if (ancla && aviso) ancla.insertAdjacentHTML('afterend', aviso);
    }
    var pie = doc.querySelector('footer.block-footer');
    (pie || doc.body).insertAdjacentHTML(pie ? 'beforebegin' : 'beforeend', pieHTML(base));
    doc.documentElement.classList.add('lzp-listo');
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', montar); else montar();
})(typeof window !== 'undefined' ? window : this);
