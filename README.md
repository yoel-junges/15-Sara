# 💫 Invitación XV Años - Sari

Un sitio web elegante y moderno para la invitación de los XV años de Sari, construido con HTML, CSS y JavaScript puro, optimizado para Netlify.

## 🌟 Características

- **Diseño Responsive**: Mobile-first, se adapta a todos los dispositivos
- **Paleta Elegante**: Celeste, azul claro, lila pastel y detalles plateados
- **Tipografías Modernas**: Playfair Display para títulos, Inter para texto
- **Cuenta Regresiva**: Contador en tiempo real hasta el evento
- **Formulario RSVP**: Confirmación de asistencia con guardado local
- **Galería de Fotos**: Grid responsive con 6 imágenes placeholder
- **Accesibilidad**: Navegación por teclado, contraste adecuado, etiquetas semánticas
- **SEO Optimizado**: Meta tags, Open Graph, estructura semántica

## 📁 Estructura del Proyecto

```
sari-xv-invitacion/
├── index.html              # Página principal
├── styles.css              # Estilos CSS
├── script.js               # JavaScript funcional
├── assets/
│   ├── img/                # Imágenes de la galería
│   │   ├── ph-1.jpg        # Placeholder 1
│   │   ├── ph-2.jpg        # Placeholder 2
│   │   ├── ph-3.jpg        # Placeholder 3
│   │   ├── ph-4.jpg        # Placeholder 4
│   │   ├── ph-5.jpg        # Placeholder 5
│   │   └── ph-6.jpg        # Placeholder 6
│   └── icons/
│       ├── favicon.svg     # Icono del navegador
│       └── app-icon.svg    # Icono de la app
├── netlify.toml            # Configuración de Netlify
└── README.md               # Este archivo
```

## 🚀 Cómo Ejecutar Localmente

### Opción 1: Abrir directamente
1. Abrir `index.html` en cualquier navegador web moderno
2. El sitio funcionará completamente sin servidor

### Opción 2: Servidor local (recomendado)
```bash
# Con Node.js
npx serve .

# Con Python 3
python -m http.server 8000

# Con PHP
php -S localhost:8000
```

Luego abrir `http://localhost:8000` en el navegador.

## 📤 Cómo Subir a GitHub

1. **Crear repositorio en GitHub**
   ```bash
   # Inicializar git (si no existe)
   git init
   
   # Agregar archivos
   git add .
   
   # Commit inicial
   git commit -m "Initial commit: Invitación XV años Sari"
   
   # Conectar con repositorio remoto
   git remote add origin https://github.com/tu-usuario/sari-xv-invitacion.git
   
   # Subir código
   git push -u origin main
   ```

2. **Configurar .gitignore** (opcional)
   ```gitignore
   # Archivos temporales
   .DS_Store
   Thumbs.db
   
   # Logs
   *.log
   
   # Archivos de editor
   .vscode/
   .idea/
   ```

## 🌐 Cómo Desplegar en Netlify

### Opción 1: Drag & Drop (Más Rápido)
1. Ir a [netlify.com](https://netlify.com)
2. Crear cuenta o iniciar sesión
3. Arrastrar la carpeta del proyecto al área de deploy
4. ¡Listo! El sitio estará disponible en una URL aleatoria

### Opción 2: Conectar Repositorio GitHub
1. En Netlify, hacer clic en "New site from Git"
2. Conectar cuenta de GitHub
3. Seleccionar el repositorio `sari-xv-invitacion`
4. Configurar:
   - **Build command**: (dejar vacío)
   - **Publish directory**: `.` (punto)
5. Hacer clic en "Deploy site"

### Configuración Adicional en Netlify
- **Dominio personalizado**: En Site settings > Domain management
- **HTTPS**: Se habilita automáticamente
- **Formularios**: Activar en Site settings > Forms (para futuras mejoras)

## ⚙️ Configuraciones Personalizables

### 📅 Cambiar Fecha y Hora del Evento
Editar en `index.html` línea ~85:
```html
<div class="countdown" data-event-datetime="2025-11-08T21:00:00-03:00">
```

Formato: `YYYY-MM-DDTHH:MM:SS±HH:MM`
- Ejemplo: `2025-11-08T21:00:00-03:00` = 8 de noviembre 2025, 9:00 PM (Argentina)

### 🖼️ Reemplazar Imágenes

#### Imágenes de la Galería
1. Reemplazar archivos en `assets/img/`:
   - `ph-1.jpg` → Foto de preparativos
   - `ph-2.jpg` → Celebración familiar
   - `ph-3.jpg` → Momentos especiales
   - `ph-4.jpg` → Recuerdos de infancia
   - `ph-5.jpg` → Amigos y familia
   - `ph-6.jpg` → Celebrando la vida

2. **Especificaciones recomendadas**:
   - Formato: JPG
   - Dimensiones: 400x300px (mínimo)
   - Tamaño: < 500KB por imagen
   - Optimizar para web

#### Imagen Open Graph
- Crear `assets/img/og-image.jpg`
- Dimensiones: 1200x630px
- Incluir texto "Sari - Mis XV años"

### 📝 Editar Textos

#### Mensaje Principal
En `index.html` línea ~95:
```html
<p>Hay historias y personas que no voy a olvidar...</p>
```

#### Información del Lugar
En `index.html` línea ~105:
```html
<h3 class="location-name">Quinta "Magnolia"</h3>
<p class="location-address">Ruta 70 — Esperanza, Santa Fe</p>
```

#### Valores de Tarjeta
En `index.html` línea ~140:
```html
<td>Adultos</td>
<td>$35</td>
```

#### Alias de Pago
En `index.html` línea ~165:
```html
Alias: <strong>roxanajossen.mp</strong>
```

#### Fecha Límite de Pago
En `index.html` línea ~170:
```html
Fecha límite de pago: 15 de octubre de 2025
```

## 🔧 Próximos Pasos (TODOs)

### 1. Activar Mapa Embed
En `index.html` línea ~110, descomentar:
```html
<div class="location-map">
  <iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe>
</div>
```

### 2. Integración de Formulario RSVP
Opciones a implementar:
- **WhatsApp**: Enviar confirmación por WhatsApp
- **Google Forms**: Integrar con formulario de Google
- **Google Sheets**: Via Apps Script para guardar respuestas
- **Email**: Envío automático por email

### 3. Funcionalidades Adicionales
- **Botón "Agregar al Calendario"**: Generar archivo .ics
- **Compartir en Redes Sociales**: Botones de compartir
- **Animaciones**: Efectos de entrada con Intersection Observer
- **PWA**: Convertir en Progressive Web App

### 4. Optimizaciones
- **Lazy Loading**: Para imágenes de la galería
- **Service Worker**: Para cache offline
- **Compresión**: Optimizar imágenes automáticamente
- **CDN**: Para assets estáticos

## 🎨 Personalización de Colores

Editar variables CSS en `styles.css` línea ~3:
```css
:root {
  --celeste: #87CEEB;
  --azul-claro: #B0E0E6;
  --lila-pastel: #DDA0DD;
  --plateado: #C0C0C0;
  --texto: #2C3E50;
  --fondo: #FAFAFA;
}
```

## 📱 Compatibilidad

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Dispositivos móviles (iOS/Android)

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Variables, Grid, Flexbox, Gradientes
- **JavaScript ES6+**: Funcionalidades interactivas
- **Google Fonts**: Playfair Display + Inter
- **Netlify**: Hosting y deployment

## 📞 Soporte

Para dudas o problemas:
1. Revisar la consola del navegador (F12)
2. Verificar que todas las imágenes existan
3. Comprobar que la fecha del evento sea futura
4. Asegurar que el formulario tenga campos requeridos

## 📄 Licencia

Este proyecto es para uso personal. Todos los derechos reservados.

---

**¡Que sea una celebración inolvidable! 🎉**

*Hecho con ❤️ para Sari y sus XV años*
