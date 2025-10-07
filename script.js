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
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
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
      form.acompanantes.value = saved.acompanantes ?? '';
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
      acompanantes: form.acompanantes.value ? Number(form.acompanantes.value) : ''
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

  function buildMessage({nombre, asistencia, restricciones, acompanantes}) {
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
      line('Acompañantes', (acompanantes === '' ? '-' : acompanantes)),
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
    const acompanantes = form.acompanantes.value ? Number(form.acompanantes.value) : '';

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

    const text = buildMessage({nombre, asistencia, restricciones, acompanantes});
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

    // Deshabilitar mientras abrimos
    const btnSend = document.getElementById('sendBtn');
    if(btnSend){ btnSend.disabled = true; setTimeout(()=> { btnSend.disabled = false; }, 1500); }

    // Abrir WhatsApp
    window.open(url, '_blank', 'noopener,noreferrer');
  });

})();

// ===== GOOGLE MAPS =====
function openGoogleMaps() {
    const searchQuery = 'Quinta+Magnolia+Ruta+70+Esperanza+Santa+Fe';
    const mapsUrl = `https://maps.google.com/?q=${searchQuery}`;
    window.open(mapsUrl, '_blank');
}

// ===== UTILIDADES ADICIONALES =====

// Función para copiar alias al portapapeles (opcional)
function copyAlias() {
    const alias = 'roxanajossen.mp';
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(alias).then(() => {
            showToast('Alias copiado al portapapeles', 'success');
        }).catch(() => {
            fallbackCopyTextToClipboard(alias);
        });
    } else {
        fallbackCopyTextToClipboard(alias);
    }
}

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

// ===== LAZY LOADING PARA IMÁGENES =====
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src || img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

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
