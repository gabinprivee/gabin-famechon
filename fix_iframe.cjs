const fs = require('fs');
let code = fs.readFileSync('src/components/LevelModal.tsx', 'utf8');

// Fix the fillText line
code = code.replace(
  "window.ctx.fillText('Niveau ${level.id} - ${level.title.replace(/`/g, \"'\")}', 20, 65);",
  "window.ctx.fillText(`Niveau ${level.id} - ${decodeURIComponent('${encodeURIComponent(level.title)}')}`, 20, 65);"
);

// Fix the cat line
code = code.replace(
  "const cat = '${level.title.toLowerCase()}';",
  "const cat = decodeURIComponent('${encodeURIComponent(level.title.toLowerCase())}');"
);

fs.writeFileSync('src/components/LevelModal.tsx', code);
