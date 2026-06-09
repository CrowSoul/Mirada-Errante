Guía rápida para conectar Firebase Realtime Database

Objetivo
- Crear un proyecto en Firebase y habilitar Realtime Database.
- Obtener el objeto de configuración (apiKey, authDomain, databaseURL, etc.).
- Conectar la web copiando el JSON en el panel de administración (`admin.html`) o usando un archivo local durante desarrollo.

Pasos

1) Crear proyecto Firebase
- Ve a https://console.firebase.google.com/ y crea un nuevo proyecto.
- Asigna un nombre (por ejemplo: mirada-errante) y completa los pasos.

2) Añadir app web
- En la vista del proyecto, haz clic en el icono "</>" (Add app) para crear una aplicación web.
- Registra la app (puedes poner "mirada-errante-web").
- Firebase te mostrará un bloque de configuración JavaScript con campos: `apiKey`, `authDomain`, `databaseURL`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`, `measurementId`.

3) Habilitar Realtime Database
- En el panel izquierdo, selecciona "Realtime Database" → "Create database".
- Para desarrollo rápido, selecciona "Start in test mode" (permitirá lecturas/escrituras). Para producción, configura reglas estrictas.

Reglas de ejemplo (modo de prueba):
{
  "rules": {
    ".read": true,
    ".write": true
  }
}

4) Conectar la web
- Opciones:
  a) Pegar el objeto JSON en el panel admin: abre `admin.html`, ve a la sección "Sincronización en tiempo real (Firebase)", pega el objeto JSON EXACTO que Firebase te da (el bloque de configuración) y pulsa "Conectar Firebase".
  b) (opcional) Crear un archivo local `firebase-config.json` con el mismo objeto y, durante desarrollo, usarlo para inicializar la app. No recomendamos subir credenciales sensibles al repositorio público.

5) Verificación
- Tras conectar, el estado mostrará "Conectado".
- Abre la app en otro navegador/dispositivo y conecta con la misma configuración; las escrituras deberían sincronizarse en tiempo real.

Consejos para GitHub
- Incluye `firebase.example.json` con valores de ejemplo (ya está en el repo).
- NO subas `firebase-config.json` con credenciales reales si el repositorio será público. En su lugar, pega el JSON en el admin tras desplegar.

Problemas comunes
- Si no ves cambios remotos, revisa Realtime Database rules y la `databaseURL` del config.
- Asegúrate de habilitar Realtime Database (no Firestore) para usar la integración que se incluyó en `script.js`.

Si quieres, puedo:
- Generar un pequeño script de inicialización que cargue `firebase-config.json` desde la raíz (útil para deploy privado).
- Proporcionar las reglas recomendadas para producción.
