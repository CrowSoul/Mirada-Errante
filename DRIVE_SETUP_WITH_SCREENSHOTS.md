# Guía: Configurar sincronización a Google Drive (con capturas)

Esta guía paso a paso explica cómo crear la cuenta de servicio, compartir la carpeta de Drive, generar el secret base64 y añadir los secrets en GitHub. Incluye marcadores para que añadas capturas en la carpeta `screenshots/` del repositorio.

Instrucciones generales para capturas (Windows):
- Usa la herramienta "Recortes y anotación" (Snipping Tool) o presiona `Win + Shift + S` para capturar una región.
- Guarda cada captura en la carpeta `screenshots/` dentro del repo con los nombres sugeridos abajo.
- Inserta las imágenes en este documento o en el `README.md` usando Markdown: `![Descripción](screenshots/1-create-project.png)`.

Archivos y nombres de captura recomendados (guarda aquí):
- `screenshots/1-create-project.png` — crear proyecto en Google Cloud
- `screenshots/2-enable-drive-api.png` — habilitar Google Drive API
- `screenshots/3-create-sa.png` — crear cuenta de servicio
- `screenshots/4-download-key.png` — descargar key JSON
- `screenshots/5-share-folder.png` — compartir carpeta con la cuenta de servicio
- `screenshots/6-get-folder-id.png` — copiar ID de carpeta desde URL
- `screenshots/7-generate-b64.png` — generar base64 en PowerShell
- `screenshots/8-add-secrets.png` — añadir secrets en GitHub
- `screenshots/9-pages-settings.png` — habilitar GitHub Pages (opcional)
- `screenshots/10-actions-run.png` — ver ejecución del workflow en Actions

Pasos detallados

1) Crear proyecto y habilitar Drive API

- Ve a https://console.cloud.google.com/ y crea un nuevo proyecto.
- Captura la pantalla del panel de creación: guarda como `screenshots/1-create-project.png`.
- Habilita API: Navega a "API & Services → Library", busca "Google Drive API" y pulsa "Enable". Captura y guarda `screenshots/2-enable-drive-api.png`.

2) Crear cuenta de servicio y descargar la clave JSON

- Ve a "IAM & Admin → Service Accounts → Create Service Account".
- Rellena nombre/descrición; crea la cuenta. Captura `screenshots/3-create-sa.png`.
- En la cuenta de servicio crea una key JSON (JSON key) y descarga `key.json`. Captura la pantalla de la descarga como `screenshots/4-download-key.png`.

3) Compartir la carpeta de Drive con la cuenta de servicio

- Abre la carpeta en Drive (la URL que proporcionaste previamente).
- Pulsa "Compartir" y añade el email de la cuenta de servicio (algo@PROJECT.iam.gserviceaccount.com) como Editor. Guarda captura `screenshots/5-share-folder.png`.
- Copia el ID de la carpeta desde la URL `https://drive.google.com/drive/folders/<FOLDER_ID>` y guarda captura `screenshots/6-get-folder-id.png`.

4) Generar base64 del JSON (PowerShell en Windows)

- Guarda `key.json` en una ruta segura, p. ej. `C:\Users\TU_USUARIO\Downloads\key.json`.
- Abre PowerShell y ejecuta:

```powershell
$base64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\ruta\a\key.json'))
$base64 | Out-File -Encoding ascii key.json.b64
Get-Content key.json.b64
```

- Copia la salida (una sola línea). Captura la ventana de PowerShell como `screenshots/7-generate-b64.png`.

5) Añadir Secrets en GitHub

- En GitHub: `Repository → Settings → Secrets and variables → Actions → New repository secret`.
- Añade:
  - `GDRIVE_SERVICE_ACCOUNT_JSON_B64` : pega el contenido base64.
  - `GDRIVE_FOLDER_ID` : el ID de la carpeta.
  - (Opcional) `ENABLE_PAGES` : `true` para publicar en GitHub Pages.
- Captura la pantalla de la creación de secrets y guárdala como `screenshots/8-add-secrets.png`.

6) (Opcional) Habilitar GitHub Pages

- Repo → Settings → Pages → Source: Branch `main`, Folder `/ (root)` → Save.
- Captura `screenshots/9-pages-settings.png`.

7) Verificar ejecución del workflow

- Haz commit/push a `main`. En GitHub → Actions verás el run del workflow `.github/workflows/sync-to-drive.yml`.
- Abre el run y revisa los pasos `Install rclone`, `Configure rclone`, `Sync to Google Drive` y (si aplica) `Deploy to GitHub Pages`.
- Captura la vista del run y guárdala como `screenshots/10-actions-run.png`.

Insertar las capturas en Markdown

Ejemplo para insertar una captura en este documento:

```markdown
![Crear proyecto](screenshots/1-create-project.png)
```

Consejos de seguridad

- No comites `key.json` ni `key.json.b64` al repositorio público.
- Usa los `Secrets` de GitHub para almacenar la clave de la cuenta de servicio.

¿Quieres que cree la carpeta `screenshots/` en el repo ahora y un archivo de ejemplo con las etiquetas Markdown ya incluidas para que solo pegues las imágenes? Puedo generarlo y luego guiarte para hacer push con las capturas.

Fin de la guía
