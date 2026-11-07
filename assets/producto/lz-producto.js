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
  var SECCIONES = [['/tienda', 'Tienda'], ['/disena-tu-bano', 'Diseña tu baño'], ['/calculadora', 'Calculadora'], ['/porcelanato', 'Porcelanato'], ['/profesionales', 'Profesionales']];
  var CATEGORIAS = ['Muebles de baño', 'Espejos LED', 'Lavabos', 'Grifería', 'Cocina', 'Accesorios'];

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
    return '<header class="lzp-hdr"><div class="lzp-hdr-top"><a class="lzp-logo" href="/"><img src="' + esc(base) + 'assets/marca/logo-lz-negro.png" alt="LANZAMIENTO · inicio" width="176" height="60"></a>' +
      '<nav class="lzp-nav" aria-label="Principal">' + enlaces(false) + '</nav>' +
      '<button class="lzp-menu-btn" type="button" aria-expanded="false" aria-controls="lzp-menu">Menú</button></div>' +
      '<nav class="lzp-cats" aria-label="Categorías">' + CATEGORIAS.map(function (c) { return '<a href="' + enlaceLinea(c) + '">' + esc(c) + '</a>'; }).join('') + '<a href="/porcelanato">Porcelanato</a></nav></header>' +
      '<nav class="lzp-menu" id="lzp-menu" aria-label="Menú" hidden>' + enlaces(true) + '</nav>';
  }

  function pieHTML(base) {
    return '<footer class="lzp-pie"><div class="lzp-pie-top">' +
      '<div><img src="' + esc(base) + 'assets/marca/logo-lz-marfil.png" alt="LANZAMIENTO" width="240" height="82" loading="lazy"></div>' +
      '<div><h6>Tienda</h6><ul><li><a href="/tienda">Todos los productos</a></li><li><a href="' + enlaceLinea('Muebles de baño') + '">Muebles de baño</a></li><li><a href="' + enlaceLinea('Espejos LED') + '">Espejos LED</a></li><li><a href="/porcelanato">Porcelanato</a></li></ul></div>' +
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
    var critico = '<style>html.lz-pagina,html.lz-pagina body{background:#fff!important}html.lz-pagina body{visibility:hidden}' +
      'html.lz-pagina #lz-sitio{visibility:visible;position:fixed!important;inset:0!important;z-index:2147483000!important}</style>';
    var marca = '<script>(function(){var h=location.hostname,r=location.pathname;if(/' + EDITOR_HOST.source + '/i.test(h)||/' + EDITOR_RUTA.source + '/.test(r)||!/' + RUTAS_LZ.source + '/.test(r))return;' +
      'var d=document.documentElement;d.classList.add("lz-pagina");var q=function(){if(!document.getElementById("lz-sitio"))d.classList.remove("lz-pagina")};' +
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

  var api = { TIPOS: TIPOS, esFicha: esFicha, esPaginaLZ: esPaginaLZ, partirTitulo: partirTitulo, enlaceLinea: enlaceLinea, encabezadoHTML: encabezadoHTML, pieHTML: pieHTML, avisoVenta: avisoVenta, codigoGlobal: codigoGlobal,
    idDeRuta: idDeRuta, precioDeFicha: precioDeFicha, textoPrecio: textoPrecio, relacionadosHTML: relacionadosHTML };
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
