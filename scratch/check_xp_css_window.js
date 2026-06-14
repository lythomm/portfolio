import fs from 'fs';

const css = fs.readFileSync('node_modules/xp.css/dist/XP.css', 'utf8');

// Find occurrences of .window
const regex = /\.window[^{]*\{[^}]*\}/g;
let match;
while ((match = regex.exec(css)) !== null) {
  console.log('Match:', match[0]);
}
