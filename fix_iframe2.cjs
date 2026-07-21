const fs = require('fs');
let code = fs.readFileSync('src/components/LevelModal.tsx', 'utf8');

// The outer string is srcDoc={`...`}
// Inside we want window.ctx.fillText('Niveau ' + level.id + ' - ' + decodeURIComponent('...'), 20, 65);

code = code.replace(
  "window.ctx.fillText(`Niveau ${level.id} - ${decodeURIComponent('${encodeURIComponent(level.title)}')}`, 20, 65);",
  "window.ctx.fillText('Niveau ' + " + "${level.id}" + " + ' - ' + decodeURIComponent('${encodeURIComponent(level.title)}'), 20, 65);"
);

fs.writeFileSync('src/components/LevelModal.tsx', code);
