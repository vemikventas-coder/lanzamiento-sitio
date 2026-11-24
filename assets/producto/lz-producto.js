/* LANZAMIENTO · Fichas nativas de Webador con el diseño LZ.
   Se carga en todo el sitio desde «Ajustes → Avanzado → Código HTML» (ver codigoGlobal), pero solo actúa
   en /product/... (body.jw-is-segment-product): pone el encabezado, el menú y el pie de LANZAMIENTO,
   la ruta Tienda / Línea / Modelo y el aviso de venta, y deja la ficha nativa (precio, versiones, fotos) intacta. */
(function (raiz) {
  'use strict';
  var BASE_POR_DEFECTO = 'https://vemikventas-coder.github.io/lanzamiento-sitio/';
  /* Letra del titular (identidad «Flecha»): la pide la ficha al montarse; la hoja de estilos no lleva @import */
  var FUENTE = 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,500..900;1,6..96,500..900&display=swap';
  /* Tipo de producto (prefijo del nombre en Webador) → línea de la tienda. Igual que build/fichas-webador.mjs */
  var TIPOS = [
    ['Mueble de baño', 'Muebles de baño'], ['Espejo LED', 'Espejos LED'], ['Lavabo', 'Lavabos'],
    ['Monomando', 'Grifería'], ['Llave para tarja', 'Grifería'], ['Fregadero', 'Cocina'],
    ['Contra', 'Accesorios'], ['Coladera', 'Accesorios'], ['Cortina para baño', 'Accesorios'], ['Malla decorativa', 'Accesorios']
  ].sort(function (a, b) { return b[0].length - a[0].length; });
  var SECCIONES = [['/tienda', 'Tienda'], ['/disena-tu-bano', 'Diseña tu baño'], ['/calculadora', 'Calculadora'], ['/porcelanato', 'Porcelanato'], ['/profesionales', 'Profesionales']];
  var CATEGORIAS = ['Muebles de baño', 'Espejos LED', 'Lavabos', 'Grifería', 'Cocina', 'Accesorios'];

  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  function esFicha(clases) { return /(^|\s)jw-is-segment-product(\s|$)/.test(String(clases || '')); }
  /* Carrito y pasos del pedido: /cart, /cart/details, /cart/shipping, /cart/payment, /cart/confirmation */
  var RUTA_CAJA = /^\/cart(\/|$)/;
  function esCaja(ruta) { return RUTA_CAJA.test(String(ruta || '')); }
  function carritoVacioHTML() { return '<a class="lzp-btn" href="/tienda">Ver la tienda<i aria-hidden="true">→</i></a>'; }

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

  /* carrito: true cuando la ficha trae botón de compra (pedidos abiertos en Webador) */
  function encabezadoHTML(base, carrito) {
    var lupa = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"/><path d="M13 13l4.5 4.5"/></svg>';
    return '<header class="lzp-hdr"><div class="lzp-hdr-top"><a class="lzp-logo" href="/"><img src="' + esc(base) + 'assets/marca/logo-lz-negro.png" alt="LANZAMIENTO · inicio" width="88" height="30"></a>' +
      '<form class="lzp-buscar" action="/tienda" method="get" role="search"><input name="q" type="search" placeholder="¿Qué buscas? Mueble, espejo, lavabo, código…" aria-label="Buscar en la tienda" autocomplete="off"><button type="submit" aria-label="Buscar">' + lupa + '</button></form>' +
      '<nav class="lzp-nav" aria-label="Principal">' + enlaces(false) + '</nav>' +
      (carrito ? '<a class="lzp-carrito" href="/cart"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 3h2.5l2 10h9l2-7H6"/><circle cx="8" cy="17" r="1.2"/><circle cx="15" cy="17" r="1.2"/></svg>Carrito</a>' : '') +
      '<button class="lzp-menu-btn" type="button" aria-expanded="false" aria-controls="lzp-menu">Menú</button></div>' +
      '<nav class="lzp-cats" aria-label="Categorías">' + CATEGORIAS.map(function (c) { return '<a href="' + enlaceLinea(c) + '">' + esc(c) + '</a>'; }).join('') + '<a href="/porcelanato">Porcelanato</a></nav></header>' +
      '<nav class="lzp-menu" id="lzp-menu" aria-label="Menú" hidden>' + enlaces(true) + '</nav>';
  }

  function pieHTML(base) {
    return '<footer class="lzp-pie"><div class="lzp-pie-top">' +
      '<div><img src="' + esc(base) + 'assets/marca/logo-lz-marfil.png" alt="LANZAMIENTO" width="150" height="51" loading="lazy"><p class="lzp-pie-lema">Muebles de baño, espejos LED, lavabos, grifería y porcelanato, con precio con IVA en cada pieza.</p></div>' +
      '<div><h6>Tienda</h6><ul><li><a href="/tienda">Todos los productos</a></li><li><a href="' + enlaceLinea('Muebles de baño') + '">Muebles de baño</a></li><li><a href="' + enlaceLinea('Espejos LED') + '">Espejos LED</a></li><li><a href="/porcelanato">Porcelanato</a></li></ul></div>' +
      '<div><h6>Herramientas</h6><ul><li><a href="/disena-tu-bano">Diseña tu baño</a></li><li><a href="/calculadora">Calculadora de cajas</a></li></ul></div>' +
      '<div><h6>Profesionales</h6><ul><li><a href="/profesionales">Arquitectos y obra</a></li><li><a href="/porcelanato">Fichas técnicas</a></li></ul></div>' +
      '</div><div class="lzp-pie-base"><span>LANZAMIENTO · ' + new Date().getFullYear() + '</span><span>Precios con IVA incluido.</span></div></footer>';
  }

  function avisoVenta(hayBoton) {
    return hayBoton ? '' : '<p class="lzp-aviso"><b>Venta en línea próximamente</b><span>Precio con IVA incluido</span></p>';
  }

  /* Las 6 páginas con bloque LZ: se marcan en el <head>, antes de pintar, para que no se vea la plantilla ni la carga */
  var RUTAS_LZ = /^\/(disena-tu-bano|porcelanato|calculadora|tienda|profesionales)?\/?$/;
  var EDITOR_HOST = /^www\.webador\./i, EDITOR_RUTA = /^\/v2\//;
  function esPaginaLZ(ruta, host) {
    if (EDITOR_HOST.test(host || '') || EDITOR_RUTA.test(ruta || '')) return false;
    return RUTAS_LZ.test(ruta || '/');
  }

  function codigoGlobal(base) {
    var critico = '<style>html.lz-pagina,html.lz-pagina body{background:#fff!important}html.lz-pagina body{visibility:hidden}' +
      'html.lz-pagina #lz-sitio{visibility:visible;position:fixed!important;inset:0!important;z-index:2147483000!important}</style>';
    var marca = '<script>(function(){var h=location.hostname,r=location.pathname,d=document.documentElement;if(/' + RUTA_CAJA.source + '/.test(r))d.classList.add("lzp-caja");' +
      'if(/' + EDITOR_HOST.source + '/i.test(h)||/' + EDITOR_RUTA.source + '/.test(r)||!/' + RUTAS_LZ.source + '/.test(r))return;' +
      'd.classList.add("lz-pagina");var q=function(){if(!document.getElementById("lz-sitio"))d.classList.remove("lz-pagina")};' +
      'document.addEventListener("DOMContentLoaded",q);setTimeout(q,4000)})();</script>';
    return critico + marca + '<link rel="stylesheet" href="' + base + 'assets/fuentes/fuentes.css">' +
      '<link rel="stylesheet" href="' + base + 'assets/producto/lz-producto.css">' +
      '<script src="' + base + 'assets/producto/lz-producto.js" defer></script>';
  }

  /* «También te puede interesar»: la lista la arma build/relacionados.mjs (JSON en el alojamiento, junto a este archivo) */
  function idDeRuta(ruta) { var m = String(ruta || '').match(/^\/product\/(\d+)(\/|$)/); return m ? m[1] : null; }
  function precioDeFicha(html) {
    var tag = (String(html || '').match(/<meta[^>]*itemprop="price"[^>]*>/) || [])[0];
    var v = tag && (tag.match(/\scontent="([^"]*)"/) || [])[1];
    var n = v != null ? parseFloat(String(v).replace(/[^\d.]/g, '')) : NaN;
    return isFinite(n) ? n : null;
  }
  function textoPrecio(n) {
    if (!(Number(n) > 0)) return 'Ver precio';
    var p = Number(n).toFixed(2).split('.');
    return '$' + p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + p[1] + ' MXN';
  }
  function relacionadosHTML(items, base) {
    if (!items || !items.length) return '';
    return '<section class="lzp-rel" aria-labelledby="lzp-rel-t"><h2 id="lzp-rel-t">También te puede interesar</h2><div class="lzp-rel-grid">' +
      items.map(function (x) {
        return '<a class="lzp-rel-card" href="' + esc(x.url) + '">' +
          '<span class="lzp-rel-foto"><img src="' + esc(base + x.img) + '" alt="' + esc(x.tipo + ' ' + x.modelo) + '" loading="lazy" decoding="async" width="480" height="600"></span>' +
          '<span class="lzp-rel-tipo">' + esc(x.tipo) + '</span><b class="lzp-rel-modelo">' + esc(x.modelo) + '</b>' +
          '<span class="lzp-rel-precio" data-precio-url="' + esc(x.url) + '">Ver precio</span>' +
          '<span class="lzp-rel-ir">Ver ficha <i aria-hidden="true">→</i></span></a>';
      }).join('') + '</div></section>';
  }

  var api = { TIPOS: TIPOS, FUENTE: FUENTE, esFicha: esFicha, esCaja: esCaja, carritoVacioHTML: carritoVacioHTML, esPaginaLZ: esPaginaLZ, partirTitulo: partirTitulo, enlaceLinea: enlaceLinea, encabezadoHTML: encabezadoHTML, pieHTML: pieHTML, avisoVenta: avisoVenta, codigoGlobal: codigoGlobal,
    idDeRuta: idDeRuta, precioDeFicha: precioDeFicha, textoPrecio: textoPrecio, relacionadosHTML: relacionadosHTML };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; return; }
  raiz.LZ = raiz.LZ || {}; raiz.LZ.producto = api;

  /* ---------- En la ficha ---------- */
  var doc = raiz.document, guion = doc.currentScript;
  var base = (guion && guion.src && guion.src.replace(/assets\/producto\/lz-producto\.js.*$/, '')) || BASE_POR_DEFECTO;

  function montar() {
    var raizDoc = doc.documentElement;
    var caja = esCaja(raiz.location && raiz.location.pathname) || raizDoc.classList.contains('lzp-caja');
    if ((!esFicha(doc.body && doc.body.className) && !caja) || doc.querySelector('.lzp-hdr')) return;
    if (caja) raizDoc.classList.add('lzp-caja');
    if (!doc.querySelector('link[data-lzp-fuente]')) {
      var letra = doc.createElement('link'); letra.rel = 'stylesheet'; letra.href = FUENTE; letra.setAttribute('data-lzp-fuente', ''); doc.head.appendChild(letra);
    }
    var abierto = caja || !!doc.querySelector('.js-product-container__button');
    var salto = doc.querySelector('.jw-skip-link');
    (salto || doc.body.firstChild) && (salto ? salto.insertAdjacentHTML('afterend', encabezadoHTML(base, abierto)) : doc.body.insertAdjacentHTML('afterbegin', encabezadoHTML(base, abierto)));
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
    /* Carrito vacío: Webador solo deja el título y una línea; se agrega el botón para volver a la tienda.
       El aviso «está vacío» viene escrito desde el servidor, así que no depende de que el carrito termine de cargar. */
    if (caja && !doc.querySelector('.cart-item, .lzp-btn')) {
      var paso = doc.querySelector('[data-checkout-step]') || doc.querySelector('.main-content');
      if (paso && /vac[ií]o/i.test(paso.textContent)) paso.insertAdjacentHTML('beforeend', carritoVacioHTML());
    }
    var pie = doc.querySelector('footer.block-footer');
    (pie || doc.body).insertAdjacentHTML(pie ? 'beforebegin' : 'beforeend', pieHTML(base));
    doc.documentElement.classList.add('lzp-listo');
    var id = idDeRuta(raiz.location && raiz.location.pathname);
    if (ficha && id) relacionados(id, ficha);
  }

  function relacionados(id, ficha) {
    if (!raiz.fetch) return;
    raiz.fetch(base + 'assets/producto/relacionados.json').then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      var lista = (j && j.rel && j.rel[id]) || [];
      var h = relacionadosHTML(lista.map(function (i) { return j.productos[i]; }).filter(Boolean), base);
      if (!h || doc.querySelector('.lzp-rel')) return;
      ficha.insertAdjacentHTML('afterend', h);
      /* precio de cada sugerencia: de su ficha nativa, cuando la sección se acerca a la pantalla */
      var pedir = function (el) {
        raiz.fetch(el.getAttribute('data-precio-url'), { credentials: 'same-origin' })
          .then(function (r) { return r.ok ? r.text() : ''; })
          .then(function (html) { el.textContent = textoPrecio(precioDeFicha(html)); })
          .catch(function () {});
      };
      var els = doc.querySelectorAll('.lzp-rel [data-precio-url]');
      if (!('IntersectionObserver' in raiz)) { els.forEach(pedir); return; }
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); pedir(e.target); } });
      }, { rootMargin: '400px 0px' });
      els.forEach(function (el) { io.observe(el); });
    }).catch(function () {});
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', montar); else montar();
})(typeof window !== 'undefined' ? window : this);
