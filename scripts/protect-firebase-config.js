const fs = require('fs');
const path = require('path');

const gitignorePath = path.resolve(process.cwd(), '.gitignore');
const entry = 'firebase-config.json';

try {
  let content = '';
  if (fs.existsSync(gitignorePath)) content = fs.readFileSync(gitignorePath, 'utf8');
  const lines = content.split(/\r?\n/).map(l => l.trim());
  if (lines.includes(entry)) {
    console.log('.gitignore ya contiene firebase-config.json');
    process.exit(0);
  }
  const append = (content && !content.endsWith('\n')) ? '\n' + entry + '\n' : entry + '\n';
  fs.appendFileSync(gitignorePath, append, 'utf8');
  console.log('Se añadió firebase-config.json a .gitignore');
} catch (err) {
  console.error('Error al actualizar .gitignore:', err.message);
  process.exit(1);
}
