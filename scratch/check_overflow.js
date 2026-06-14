import fs from 'fs';
import path from 'path';

function walk(dir) {
  let files = fs.readdirSync(dir);
  for (let file of files) {
    let filepath = path.join(dir, file);
    let stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walk(filepath);
    } else if (filepath.endsWith('.vue') || filepath.endsWith('.css')) {
      let content = fs.readFileSync(filepath, 'utf8');
      let lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.includes('overflow')) {
          console.log(`${filepath}:${idx + 1}: ${line.trim()}`);
        }
      });
    }
  }
}

walk('src');
