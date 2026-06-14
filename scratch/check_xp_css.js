import fs from 'fs';

const css = fs.readFileSync('node_modules/xp.css/dist/XP.css', 'utf8');

// Find occurrences of .window-body
const regex = /\.window-body[^{]*\{[^}]*\}/g;
let match;
while ((match = regex.exec(css)) !== null) {
  console.log('Match:', match[0]);
}
