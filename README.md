# Mirada Errante

Sitio estático de exposición y venta de libros y artesanías con un estilo oscuro y elegante. Incluye cuatro páginas principales, comentarios para usuarios registrados y un panel de administrador básico.

## Archivos principales

- `index.html` — página de inicio con publicaciones y sistema de comentarios
- `biblioteca.html` — sección de biblioteca
- `artesanias.html` — sección de artesanías
- `quienes-somos.html` — página sobre el proyecto
- `admin.html` — panel de administrador con inicio de sesión
- `styles.css` — estilos oscuros, animaciones y diseño responsivo
- `script.js` — lógica de comentarios, registro de usuarios y administración

## Uso

Abre `index.html` en tu navegador para ver la página principal. Accede a `admin.html` con el usuario `miradaadmin` y la contraseña `Errante2026!`.

## Sincronización en tiempo real (Firebase)

Este proyecto incluye soporte opcional para Firebase Realtime Database. Para instrucciones paso a paso para crear un proyecto Firebase y conectar la aplicación, revisa `FIREBASE_SETUP.md`.

Se incluye `firebase.example.json` como plantilla; **no** subas credenciales reales a un repositorio público.

## Auto-sync a Google Drive y despliegue en vivo

Este repositorio puede sincronizar automáticamente los archivos a una carpeta de Google Drive y, opcionalmente, publicar en GitHub Pages cada vez que hagas `push` a la rama `main`.

Pasos rápidos (resumen):

1. Crea un proyecto en Google Cloud y habilita la **Google Drive API**.
2. Crea una **cuenta de servicio** y descarga la clave JSON.
3. Comparte la carpeta de Drive de destino con el correo de la cuenta de servicio (permiso Editor). Copia el ID de la carpeta desde la URL de Drive.
4. Añade estos `Secrets` en tu repositorio GitHub (Repository > Settings > Secrets):
	- `GDRIVE_SERVICE_ACCOUNT_JSON_B64` : el contenido de la clave JSON codificado en base64.
	- `GDRIVE_FOLDER_ID` : el ID de la carpeta de Drive donde quieres que se sincronicen los archivos.
	- `ENABLE_PAGES` (opcional) : `true` para desplegar automáticamente en GitHub Pages.

Cómo obtener el `GDRIVE_SERVICE_ACCOUNT_JSON_B64`:

- en macOS / Linux:

```bash
base64 key.json | tr -d '\n' > key.json.b64
cat key.json.b64
```

- en PowerShell (Windows):

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\path\to\key.json')) > key.json.b64
Get-Content key.json.b64
```

Comparte la carpeta: abre la carpeta en Drive, pulsa "Compartir" y añade el email de la cuenta de servicio (algo@PROJECT.iam.gserviceaccount.com) como Editor.

Qué hace el workflow:

- Archivo: `.github/workflows/sync-to-drive.yml`.
- Al hacer `push` en `main`, instala `rclone`, configura el acceso usando la clave de la cuenta de servicio y sincroniza el contenido del repositorio a la carpeta de Drive (excluye `.git`, `.github`, `node_modules`).
- Si `ENABLE_PAGES` está en `true`, también publicará el contenido en GitHub Pages.

Notas y limitaciones:

- Drive no es un hosting web optimizado; aunque puedes ver archivos directamente desde Drive, no es tan fiable ni tan rápido como GitHub Pages o Firebase Hosting para servir sitios web estáticos.
- Para ver cambios en "tiempo real" desde cualquier dispositivo, habilita `ENABLE_PAGES=true` y activa GitHub Pages en las Settings del repo.
- El Action no puede funcionar hasta que añadas los `Secrets` en GitHub y compartas la carpeta con la cuenta de servicio.

Si quieres, puedo generar también instrucciones paso a paso con capturas de comandos y ejemplos concretos para tu caso.
