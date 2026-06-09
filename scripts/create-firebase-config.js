const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const examplePath = path.join(repoRoot, 'firebase.example.json');
const targetPath = path.join(repoRoot, 'firebase-config.json');

if (fs.existsSync(targetPath)) {
  console.log('firebase-config.json ya existe. Abre y edita según tu proyecto Firebase.');
  process.exit(0);
}

if (!fs.existsSync(examplePath)) {
  console.error('No se encontró firebase.example.json. Crea uno o copia la plantilla provista.');
  process.exit(1);
}

try {
  const data = fs.readFileSync(examplePath, 'utf8');
  fs.writeFileSync(targetPath, data, { flag: 'wx' });
  console.log('Se creó firebase-config.json a partir de firebase.example.json. Edita con tus credenciales.');
} catch (err) {
  console.error('Error creando firebase-config.json:', err.message);
  process.exit(1);
}
