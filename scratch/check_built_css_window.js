import fs from 'fs';

const css = fs.readFileSync('dist/assets/index-PfFRXvuQ.css', 'utf8');

// Find all occurrences of .window (and only .window, not .window-body) in the built CSS
const regex = /\.window[^{,]*\{[^}]*\}/g;
let match;
while ((match = regex.exec(css)) !== null) {
  console.log('Match:', match[0]);
}
