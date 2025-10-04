// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupMobileMenu();
    setupCountdown();
    setupRSVPForm();
    setupSmoothScroll();
    setupToast();
    setupNavbarScroll();
}

// ===== MENÚ MÓVIL =====
function setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ===== NAVBAR SCROLL EFFECT =====
function setupNavbarScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
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
                const headerHeight = document.querySelector('.header').offsetHeight;
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
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ===== CUENTA REGRESIVA =====
function setupCountdown() {
    const countdownSection = document.querySelector('.countdown');
    if (!countdownSection) return;
    
    const eventDateTime = countdownSection.getAttribute('data-event-datetime');
    if (!eventDateTime) return;
    
    const targetDate = new Date(eventDateTime).getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            // El evento ya pasó
            showEventStarted();
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Actualizar elementos del DOM
        updateCountdownElement('days', days);
        updateCountdownElement('hours', hours);
        updateCountdownElement('minutes', minutes);
        updateCountdownElement('seconds', seconds);
    }
    
    function updateCountdownElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value.toString().padStart(2, '0');
        }
    }
    
    function showEventStarted() {
        const countdownContainer = document.querySelector('.countdown-container');
        const countdownNote = document.querySelector('.countdown-note');
        
        if (countdownContainer) {
            countdownContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <h3 style="font-family: 'Playfair Display', serif; font-size: 2rem; color: var(--celeste); margin-bottom: 1rem;">
                        ¡Llegó el gran día!
                    </h3>
                    <p style="font-size: 1.1rem; color: var(--gris-medio);">
                        ¡Es hora de celebrar!
                    </p>
                </div>
            `;
        }
        
        if (countdownNote) {
            countdownNote.style.display = 'none';
        }
    }
    
    // Actualizar inmediatamente y luego cada segundo
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== FORMULARIO RSVP =====
function setupRSVPForm() {
    const form = document.getElementById('rsvpForm');
    if (!form) return;
    
    // Cargar datos guardados
    loadSavedRSVP();
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const rsvpData = {
            nombre: formData.get('nombre'),
            asistencia: formData.get('asistencia'),
            restricciones: formData.get('restricciones') || '',
            fechaEnvio: new Date().toISOString()
        };
        
        // Validar datos
        if (!rsvpData.nombre.trim()) {
            showToast('Por favor, ingresá tu nombre completo', 'error');
            return;
        }
        
        if (!rsvpData.asistencia) {
            showToast('Por favor, confirmá tu asistencia', 'error');
            return;
        }
        
        // Guardar en localStorage
        saveRSVPToLocalStorage(rsvpData);
        
        // Mostrar confirmación
        const mensaje = rsvpData.asistencia === 'si' 
            ? `¡Gracias ${rsvpData.nombre}! Confirmamos tu asistencia. Te esperamos.`
            : `Gracias ${rsvpData.nombre} por confirmar. Lamentamos que no puedas asistir.`;
        
        showToast(mensaje, 'success');
        
        // Limpiar formulario (opcional)
        // form.reset();
    });
    
    // Auto-guardar borrador mientras escriben
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            saveDraftToLocalStorage();
        });
    });
}

function saveRSVPToLocalStorage(rsvpData) {
    try {
        localStorage.setItem('rsvpSariXV', JSON.stringify(rsvpData));
    } catch (error) {
        console.error('Error guardando RSVP:', error);
    }
}

function loadSavedRSVP() {
    try {
        const saved = localStorage.getItem('rsvpSariXV');
        if (saved) {
            const rsvpData = JSON.parse(saved);
            const form = document.getElementById('rsvpForm');
            
            if (form) {
                // Llenar campos con datos guardados
                const nombreInput = form.querySelector('#nombre');
                const restriccionesTextarea = form.querySelector('#restricciones');
                
                if (nombreInput && rsvpData.nombre) {
                    nombreInput.value = rsvpData.nombre;
                }
                
                if (restriccionesTextarea && rsvpData.restricciones) {
                    restriccionesTextarea.value = rsvpData.restricciones;
                }
                
                if (rsvpData.asistencia) {
                    const asistenciaRadio = form.querySelector(`input[name="asistencia"][value="${rsvpData.asistencia}"]`);
                    if (asistenciaRadio) {
                        asistenciaRadio.checked = true;
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error cargando RSVP guardado:', error);
    }
}

function saveDraftToLocalStorage() {
    const form = document.getElementById('rsvpForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const draftData = {
        nombre: formData.get('nombre') || '',
        asistencia: formData.get('asistencia') || '',
        restricciones: formData.get('restricciones') || '',
        isDraft: true
    };
    
    try {
        localStorage.setItem('rsvpSariXVDraft', JSON.stringify(draftData));
    } catch (error) {
        console.error('Error guardando borrador:', error);
    }
}

// ===== TOAST NOTIFICATIONS =====
function setupToast() {
    const toast = document.getElementById('toast');
    const closeBtn = toast?.querySelector('.toast-close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            hideToast();
        });
    }
    
    // Auto-hide después de 5 segundos
    window.addEventListener('toastShow', function() {
        setTimeout(hideToast, 5000);
    });
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const messageElement = toast?.querySelector('.toast-message');
    
    if (!toast || !messageElement) return;
    
    messageElement.textContent = message;
    
    // Cambiar color según tipo
    toast.className = 'toast';
    if (type === 'success') {
        toast.style.borderLeftColor = '#28a745';
    } else if (type === 'error') {
        toast.style.borderLeftColor = '#dc3545';
    } else if (type === 'warning') {
        toast.style.borderLeftColor = '#ffc107';
    }
    
    // Mostrar toast
    setTimeout(() => {
        toast.classList.add('show');
        window.dispatchEvent(new Event('toastShow'));
    }, 100);
}

function hideToast() {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.remove('show');
    }
}

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
    // ESC para cerrar menú móvil
    if (e.key === 'Escape') {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navToggle.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        // Cerrar toast
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
