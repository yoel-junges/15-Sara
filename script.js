// Anti-SW: desregistrar service workers heredados (si los hubiera)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations?.().then(function(regs){
    regs.forEach(function(reg){ reg.unregister(); });
  });
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    setupHeroBackground();
    initializeApp();
    setupMicroInteractions();
});

// ===== HERO BACKGROUND =====
function setupHeroBackground() {
    const hero = document.querySelector('#inicio.hero');
    if (hero) {
        const bg = hero.getAttribute('data-hero-bg');
        if (bg) {
            document.documentElement.style.setProperty('--hero-bg', `url("${bg}")`);
        }
    }
}

function initializeApp() {
    setupSmoothScroll();
    setupNavbarScroll();
}

// ===== MICRO-INTERACCIONES =====
function setupMicroInteractions() {
    // Entrada suave del hero
    const hero = document.querySelector('#inicio');
    
    if (hero) {
        hero.animate([
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], {
            duration: 600,
            easing: 'ease-out'
        });
    }
}


// ===== NAVBAR SCROLL EFFECT =====
function setupNavbarScroll() {
    const header = document.querySelector('.site-header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.6)';
            header.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
}

// ===== SCROLL SUAVE =====
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Si es #top, ir exactamente al inicio (0)
                if (targetId === '#top') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    // Para otras secciones, restar altura del header
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                }
            }
        });
    });
}

// Función global para scroll suave desde botones
function scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ===== CUENTA REGRESIVA HORIZONTAL PREMIUM =====
(function(){
    const root = document.querySelector('#countdown');
    if(!root) return;

    const targetISO = root.getAttribute('data-event-datetime');
    const target = targetISO ? new Date(targetISO) : null;

      const el = {
        d: document.getElementById('cd-days'),
        h: document.getElementById('cd-hours'),
        m: document.getElementById('cd-mins'),
        s: document.getElementById('cd-secs'),
        dateText: document.getElementById('eventDateText')
      };

    // Pintar fecha legible desde el atributo
    if (target && el.dateText){
        try{
            const fmtDate = new Intl.DateTimeFormat('es-AR', { weekday:'long', day:'2-digit', month:'2-digit', year:'2-digit'}).format(target);
            const fmtTime = new Intl.DateTimeFormat('es-AR', { hour:'2-digit', minute:'2-digit', hour12:false }).format(target);
            // Capitalizar primera letra del weekday
            const nice = fmtDate.charAt(0).toUpperCase() + fmtDate.slice(1);
            el.dateText.textContent = `${nice} · ${fmtTime} hs`;
        }catch{}
    }

    function pad(n){ return String(n).padStart(2,'0'); }

    function update(){
        if(!target) return;
        const now = new Date();
        const diff = target.getTime() - now.getTime();

        if(diff <= 0){
          el.d.textContent = el.h.textContent = el.m.textContent = el.s.textContent = '00';
          root.querySelector('.countdown-head h2').textContent = '¡Llegó el gran día!';
          clearInterval(tid);
          return;
        }
        const totalSec = Math.floor(diff/1000);
        const days = Math.floor(totalSec/86400);
        const hours = Math.floor((totalSec%86400)/3600);
        const mins = Math.floor((totalSec%3600)/60);
        const secs = totalSec%60;

        el.d.textContent = pad(days);
        el.h.textContent = pad(hours);
        el.m.textContent = pad(mins);
        el.s.textContent = pad(secs);
    }


    update();
    const tid = setInterval(update, 1000);
})();

// Animar separadores al entrar en viewport
(function(){
  const seps = document.querySelectorAll('.section-sep');
  if(!seps.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.2});
  seps.forEach(s => io.observe(s));
})();

// OPCIONAL: autoinsertar separadores en secciones sin uno declarado
(function(){
  const sections = document.querySelectorAll('section.section');
  sections.forEach(sec=>{
    if(sec.id === 'inicio') return;
    const container = sec.querySelector('.container') || sec;
    const has = container.querySelector('.section-sep');
    if(has) return;
    const div = document.createElement('div');
    div.className = 'section-sep';
    div.setAttribute('data-variant','heart');
    div.setAttribute('aria-hidden','true');
    div.innerHTML = `
      <span class="line"></span>
      <svg class="icon"><use href="assets/icons/decos.svg#heart"/></svg>
      <span class="line"></span>`;
    container.insertBefore(div, container.firstElementChild);
  });
})();


// ===== Player único: controla #bgAudio con el botón #topPlayBtn =====
(function(){
  const btn  = document.getElementById('topPlayBtn');
  const audio = document.getElementById('bgAudio');
  if(!btn || !audio) return;

  // Fuente desde data-src (para cambiar pista fácil)
  const ds = audio.getAttribute('data-src');
  if(ds) audio.src = ds;

  // Cache-bust opcional con version.txt si existe
  if (window.__ASSET_VERSION__ && audio.src) {
    audio.src = audio.src.split('?')[0] + '?v=' + encodeURIComponent(window.__ASSET_VERSION__);
  }

  let ctx, src, gain, playing = false, fading = false;

  function ensureGraph(){
    if(ctx) return;
    try{
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      src = ctx.createMediaElementSource(audio);
      gain = ctx.createGain();
      gain.gain.value = 0.0; // arrancamos mute para fade-in
      src.connect(gain).connect(ctx.destination);
      audio.volume = 1.0; // fallback si no hay WebAudio
    }catch{
      ctx = null; gain = null;
    }
  }

  function fadeTo(target=0.85, ms=420){
    if(!gain){ audio.volume = target; return Promise.resolve(); }
    if(fading) return Promise.resolve();
    return new Promise(res=>{
      fading = true;
      const start = gain.gain.value;
      const diff = target - start;
      const t0 = performance.now();
      function step(t){
        const p = Math.min(1,(t - t0)/ms);
        gain.gain.value = start + diff*p;
        if(p < 1) requestAnimationFrame(step);
        else { fading = false; res(); }
      }
      requestAnimationFrame(step);
    });
  }

  async function play(){
    ensureGraph();
    try{ await ctx?.resume?.(); }catch{}
    try{
      await audio.play();         // reproduce EN LA PÁGINA, sin salir
      await fadeTo(0.85, 450);    // volumen final suave
      playing = true;
      btn.setAttribute('aria-pressed','true');
    }catch(e){
      // Si el navegador requiere otro gesto, el siguiente toque al botón lo logrará.
      console.debug('Reproducción bloqueada hasta un gesto del usuario:', e?.message || e);
    }
  }

  function stop(){
    fadeTo(0.0, 350).then(()=>{
      audio.pause();
      playing = false;
      btn.setAttribute('aria-pressed','false');
    });
  }

  // Toggle del botón del header
  btn.addEventListener('click', ()=> { if(!playing) play(); else stop(); });

  // Pausar si la pestaña se oculta (buena UX)
  document.addEventListener('visibilitychange', ()=> {
    if(document.hidden && playing) stop();
  });
})();

// ===== Versión de build: detectar cambios y forzar recarga suave de assets =====
(function(){
  const LS_KEY = 'siteAssetVersion';
  fetch('version.txt', { cache: 'no-store' })
    .then(r => r.text())
    .then(v => {
      const newV = (v || '').trim();
      if(!newV) return;
      window.__ASSET_VERSION__ = newV;
      const oldV = localStorage.getItem(LS_KEY);
      if(oldV !== newV){
        const stamp = '?v=' + encodeURIComponent(newV);
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link=>{
          if(!link.href) return;
          if(!link.href.includes(stamp)){
            link.href = link.href.split('?')[0] + stamp;
          }
        });
        document.querySelectorAll('script[src]').forEach(s=>{
          const src = s.getAttribute('src');
          if(!src) return;
          if(!src.includes('version-check.js')){
            s.src = src.split('?')[0] + stamp;
          }
        });
        localStorage.setItem(LS_KEY, newV);
      }
    }).catch(()=>{});
})();

// ===== Confirmación (RSVP) por WhatsApp =====
(function(){
  const form = document.getElementById('rsvpForm');
  if(!form) return;

  const LS_KEY = 'rsvpSariXV';
  const toast = document.getElementById('toast');
  const btnSend = document.getElementById('sendBtn');
  const btnSave = document.getElementById('saveBtn');

  // Cargar borrador si existe
  try{
    const saved = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
    if(saved){
      form.nombre.value = saved.nombre || '';
      if(saved.asistencia){
        const r = form.querySelector(`input[name="asistencia"][value="${saved.asistencia}"]`);
        if(r) r.checked = true;
      }
      form.restricciones.value = saved.restricciones || '';
      // form.acompanantes.value = saved.acompanantes ?? ''; // Campo eliminado
    }
  }catch{}

  function showToast(msg){
    if(!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(()=> toast.classList.remove('show'), 1800);
  }

  function saveDraft(){
    const data = {
      nombre: form.nombre.value.trim(),
      asistencia: (form.querySelector('input[name="asistencia"]:checked') || {}).value || '',
      restricciones: form.restricciones.value.trim(),
      // acompanantes: form.acompanantes.value ? Number(form.acompanantes.value) : '' // Campo eliminado
    };
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    showToast('Borrador guardado.');
  }

  if(btnSave) btnSave.addEventListener('click', saveDraft);

  function setError(id, msg){
    const el = document.getElementById(id);
    if(el) el.textContent = msg || '';
  }
  function clearErrors(){
    setError('err-nombre','');
    setError('err-asistencia','');
  }

  function buildMessage({nombre, asistencia, restricciones}) {
    const root = document.querySelector('#countdown');
    const iso = root ? root.getAttribute('data-event-datetime') : null;
    let fechaLegible = '';
    if(iso){
      try{
        const target = new Date(iso);
        const d = new Intl.DateTimeFormat('es-AR', { weekday:'long', day:'2-digit', month:'2-digit', year:'2-digit'}).format(target);
        const t = new Intl.DateTimeFormat('es-AR', { hour:'2-digit', minute:'2-digit', hour12:false }).format(target);
        fechaLegible = `${d.charAt(0).toUpperCase()}${d.slice(1)} · ${t} hs`;
      }catch{}
    }

    const line = (k,v)=> v ? `${k}: ${v}` : `${k}: -`;
    const parts = [
      'Confirmación de asistencia — Mis XV',
      fechaLegible ? `Evento: ${fechaLegible}` : '',
      line('Nombre', nombre),
      line('Asistencia', asistencia),
      // line('Acompañantes', (acompanantes === '' ? '-' : acompanantes)), // Campo eliminado
      line('Restricciones', (restricciones || '-'))
    ].filter(Boolean);

    return parts.join('\n');
  }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    clearErrors();

    // Honeypot
    if(form.empresa && form.empresa.value){ return; }

    const nombre = form.nombre.value.trim();
    const asistenciaEl = form.querySelector('input[name="asistencia"]:checked');
    const asistencia = asistenciaEl ? asistenciaEl.value : '';
    const restricciones = form.restricciones.value.trim();
    // const acompanantes = form.acompanantes.value ? Number(form.acompanantes.value) : ''; // Campo eliminado

    let valid = true;
    if(!nombre){
      setError('err-nombre','Ingresá tu nombre completo.');
      valid = false;
    }
    if(!asistencia){
      setError('err-asistencia','Elegí una opción.');
      valid = false;
    }
    if(!valid) return;

    // Guardar borrador
    saveDraft();

    // Armar link de WhatsApp
    const phone = form.getAttribute('data-wa-number') || '';
    if(!phone){
      showToast('No se configuró el número de WhatsApp.');
      return;
    }

    const text = buildMessage({nombre, asistencia, restricciones});
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

    // Deshabilitar mientras abrimos
    const btnSend = document.getElementById('sendBtn');
    if(btnSend){ btnSend.disabled = true; setTimeout(()=> { btnSend.disabled = false; }, 1500); }

    // Abrir WhatsApp
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
      showToast('Redirigiendo a WhatsApp...');
    } catch (error) {
      console.error('Error al abrir WhatsApp:', error);
      // Fallback: copiar mensaje al portapapeles
      try {
        navigator.clipboard.writeText(text);
        showToast('Mensaje copiado al portapapeles. Pegalo en WhatsApp manualmente.');
      } catch (clipboardError) {
        console.error('Error al copiar al portapapeles:', clipboardError);
        showToast('Error al abrir WhatsApp. Por favor, contactá directamente.');
      }
    }
  });

})();

// ===== Música con overlay de entrada =====
(function(){
  const btn  = document.getElementById('musicToggle');
  const audio = document.getElementById('bgAudio');
  const overlay = document.getElementById('entryOverlay');
  const entryBtn = document.getElementById('entryBtn');
  if(!btn || !audio) return;

  let ctx, src, gain, playing = false, fading = false;

  function ensureGraph(){
    if(ctx) return;
    try{
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      src = ctx.createMediaElementSource(audio);
      gain = ctx.createGain();
      gain.gain.value = 0.0; // fade-in suave
      src.connect(gain).connect(ctx.destination);
      audio.volume = 1.0; // fallback
    }catch{ ctx=null; gain=null; }
  }
  function fadeTo(target=1.0, ms=400){
    if(!gain){ audio.volume = target; return Promise.resolve(); }
    if(fading) return Promise.resolve();
    return new Promise(res=>{
      fading = true;
      const start = gain.gain.value, diff = target - start, t0 = performance.now();
      function step(t){ const p = Math.min(1,(t - t0)/ms);
        gain.gain.value = start + diff*p;
        if(p<1) requestAnimationFrame(step); else { fading=false; res(); }
      }
      requestAnimationFrame(step);
    });
  }
  async function play(){
    ensureGraph();
    try{ await ctx?.resume?.(); }catch{}
    await audio.play();
    await fadeTo(1.0, 450);
    playing = true; btn.setAttribute('aria-pressed','true');
  }
  function stop(){
    fadeTo(0.0, 350).then(()=>{ audio.pause(); playing=false; btn.setAttribute('aria-pressed','false'); });
  }

  // Botón flotante (toggle)
  btn.addEventListener('click', ()=>{ if(!playing) play(); else stop(); });

  // Overlay de entrada: primer gesto del usuario arranca música y se oculta
  entryBtn?.addEventListener('click', async ()=>{
    try{ await play(); }catch{}
    overlay?.setAttribute('hidden','');
  });
})();

// ===== Ubicación exacta: deep-links y mapa embed =====
(function(){
  const box = document.getElementById('venue');
  if(!box) return;
  const lat = parseFloat(box.getAttribute('data-lat'));
  const lng = parseFloat(box.getAttribute('data-lng'));
  const label = box.getAttribute('data-label') || 'Destino';
  if(Number.isNaN(lat) || Number.isNaN(lng)) return;

  const mapFrame = document.getElementById('mapFrame');
  // Embed público sin API: q=lat,lng
  const z = 15;
  mapFrame.src = `https://maps.google.com/maps?q=${lat},${lng}&z=${z}&output=embed`;

  // Deep-links por plataforma
  const isIOS = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document;
  const gmaps = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=&travelmode=driving`;
  const amap  = `http://maps.apple.com/?daddr=${lat},${lng}&q=${encodeURIComponent(label)}&dirflg=d`;
  const waze  = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;

  const btnGo = document.getElementById('btnComoLlegar');
  btnGo?.addEventListener('click', ()=>{
    // En iOS priorizamos Apple Maps; si preferís Google, cambiá el orden
    const url = isIOS ? amap : gmaps;
    // Si tenés Waze y querés priorizarlo, cambiá aquí por waze
    window.open(url, '_blank', 'noopener,noreferrer');
  });

})();

// ===== UTILIDADES ADICIONALES =====

// ===== COPY ALIAS BUTTON =====
(function(){
  const btn = document.getElementById('copyAliasBtn');
  if(!btn) return;
  
  const alias = 'roxanajossen.mp';
  
  btn.addEventListener('click', async ()=>{
    try{
      await navigator.clipboard.writeText(alias);
      // Feedback visual
      const originalText = btn.textContent;
      btn.textContent = '¡Copiado!';
      btn.style.background = 'rgba(76, 175, 80, 0.1)';
      btn.style.borderColor = '#4caf50';
      
      setTimeout(()=>{
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
      }, 1500);
    }catch(err){
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = alias;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      // Feedback visual
      const originalText = btn.textContent;
      btn.textContent = '¡Copiado!';
      setTimeout(()=> btn.textContent = originalText, 1500);
    }
  });
})();

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast('Alias copiado al portapapeles', 'success');
        } else {
            showToast('No se pudo copiar el alias', 'error');
        }
    } catch (err) {
        showToast('No se pudo copiar el alias', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Lazy loading nativo: el navegador lo maneja con loading="lazy"

// ===== PERFORMANCE Y OPTIMIZACIONES =====

// Debounce para eventos de scroll
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle para eventos frecuentes
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== ACCESIBILIDAD =====

// Navegación por teclado mejorada
document.addEventListener('keydown', function(e) {
    // ESC para cerrar toast
    if (e.key === 'Escape') {
        hideToast();
    }
});

// Focus trap para modales (si se implementan)
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// ===== DEBUGGING Y LOGS =====
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🎉 Sitio de invitación XV de Sari cargado correctamente');
    console.log('📅 Fecha del evento:', document.querySelector('.countdown')?.getAttribute('data-event-datetime'));
    console.log('💾 RSVP guardado:', localStorage.getItem('rsvpSariXV') ? 'Sí' : 'No');
}
