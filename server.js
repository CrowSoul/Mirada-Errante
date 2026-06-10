const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Configuración de Google Drive
const FOLDER_ID = '1Xkks0sHztiUNH64nvQGGLzqSP5W4GKqw'; // ID de tu carpeta en Drive

let auth = null;
let drive = null;

// Función para inicializar autenticación
function initializeAuth() {
  try {
    // Intenta cargar credenciales desde archivo (para desarrollo local)
    const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || 
                   path.join(__dirname, 'service-account.json');
    
    if (!fs.existsSync(keyPath)) {
      console.warn('No se encontró service-account.json. Las operaciones en Drive no estarán disponibles.');
      console.warn(`Busca en: ${keyPath}`);
      return false;
    }

    const keyFile = require(keyPath);
    auth = new google.auth.GoogleAuth({
      keyFile: keyPath,
      scopes: ['https://www.googleapis.com/auth/drive.file']
    });

    drive = google.drive({
      version: 'v3',
      auth: auth
    });

    console.log('✓ Google Drive API inicializado correctamente');
    return true;
  } catch (err) {
    console.error('Error al inicializar Google Drive:', err.message);
    return false;
  }
}

// Ruta de prueba
app.get('/test', (req, res) => {
  if (!drive) {
    return res.status(503).json({ error: 'Google Drive no está configurado' });
  }
  res.json({ message: '✓ Servidor funcionando. Google Drive API disponible.' });
});

// Ruta principal para subir archivos a Drive
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!drive) {
    return res.status(503).json({ error: 'Google Drive no está configurado. Configura service-account.json primero.' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No se envió archivo' });
  }

  try {
    const fileName = req.file.originalname || `upload-${Date.now()}`;
    const mimeType = req.file.mimetype || 'application/octet-stream';

    const fileMetadata = {
      name: fileName,
      parents: [FOLDER_ID]
    };

    const media = {
      mimeType: mimeType,
      body: Buffer.from(req.file.buffer)
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink, name'
    });

    console.log(`✓ Archivo subido: ${file.data.name} (ID: ${file.data.id})`);

    res.json({
      success: true,
      fileId: file.data.id,
      name: file.data.name,
      webViewLink: file.data.webViewLink,
      webContentLink: file.data.webContentLink
    });
  } catch (err) {
    console.error('Error al subir archivo:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Ruta para eliminar archivo de Drive
app.delete('/file/:fileId', async (req, res) => {
  if (!drive) {
    return res.status(503).json({ error: 'Google Drive no está configurado' });
  }

  try {
    await drive.files.delete({
      fileId: req.params.fileId
    });

    console.log(`✓ Archivo eliminado: ${req.params.fileId}`);

    res.json({ success: true, message: 'Archivo eliminado de Drive' });
  } catch (err) {
    console.error('Error al eliminar archivo:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Ruta de estado
app.get('/status', (req, res) => {
  res.json({
    serverStatus: 'online',
    driveConfigured: drive !== null,
    folderId: FOLDER_ID,
    port: process.env.PORT || 3000
  });
});

// Inicializar y arrancar servidor
const PORT = process.env.PORT || 3000;

if (initializeAuth()) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`📁 Carpeta Google Drive: https://drive.google.com/drive/folders/${FOLDER_ID}`);
    console.log('\nEndpoints disponibles:');
    console.log(`  GET  /status          - Ver estado del servidor`);
    console.log(`  GET  /test            - Probar conexión a Drive`);
    console.log(`  POST /upload          - Subir archivo (multipart/form-data)`);
    console.log(`  DELETE /file/:fileId  - Eliminar archivo\n`);
  });
} else {
  console.error('\n❌ No se pudo inicializar Google Drive. Por favor configura service-account.json\n');
  process.exit(1);
}
