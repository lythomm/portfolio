import fs from 'fs';

const css = fs.readFileSync('node_modules/xp.css/dist/XP.css', 'utf8');

// Find all occurrences of overflow in CSS selectors
const regex = /([^{}]+)\{[^}]*overflow[^}]*\}/g;
let match;
while ((match = regex.exec(css)) !== null) {
  console.log('Match:', match[0].substring(0, 200));
}
