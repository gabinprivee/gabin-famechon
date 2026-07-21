const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Safely wrap localStorage.getItem
app = app.replace(
  `const saved = localStorage.getItem('gameDevProgress');\n    if (saved) {`,
  `try {\n      const saved = localStorage.getItem('gameDevProgress');\n      if (saved) {`
);

// Close the try block for getItem
app = app.replace(
  `return parsed;\n    }`,
  `return parsed;\n      }\n    } catch (e) { console.error(e); }`
);

// Safely wrap localStorage.setItem
app = app.replace(
  `localStorage.setItem('gameDevProgress', JSON.stringify(progress));`,
  `try { localStorage.setItem('gameDevProgress', JSON.stringify(progress)); } catch (e) { console.error(e); }`
);

// Safely handle flat() just in case
app = app.replace(
  `const totalCompleted = Object.values(newLevels).flat().length;`,
  `const totalCompleted = Object.values(newLevels).reduce((acc, val) => acc.concat(val || []), []).length;`
);

app = app.replace(
  `const totalProgress = Object.values(progress.levels || {}).flat().length;`,
  `const totalProgress = Object.values(progress.levels || {}).reduce((acc, val) => acc.concat(val || []), []).length;`
);

app = app.replace(
  `const totalCompleted = Object.values(progress.levels || {}).flat().length;`,
  `const totalCompleted = Object.values(progress.levels || {}).reduce((acc, val) => acc.concat(val || []), []).length;`
);

fs.writeFileSync('src/App.tsx', app);
