const fs = require('fs');
let data = fs.readFileSync('src/data.ts', 'utf8');
data = data.replace(
  /if \(i === 1\) \{[\s\S]*?\} else if \(i === 50\)/,
  `if (i === 1) {
      title = \`Niveau 1 : [THÉORIE] - Hello World du Jeu Vidéo\`;
      description = \`Bienvenue dans ta formation de Game Dev ! Avant de commencer, il faut initialiser ton environnement de boucle temporelle.\\n\\nDans un jeu, tout s'exécute des dizaines de fois par seconde grâce à requestAnimationFrame.\`;
      task = \`Recopie le code ci-dessous pour créer ta première boucle de jeu.\`;
      testCode = \`if (!code.includes('requestAnimationFrame')) throw new Error('Utilise requestAnimationFrame pour ta boucle.');\`;
      codeSnippet = \`// ----------------------------------------\\n// HELLO WORLD\\n// ----------------------------------------\\n// Copie ce code :\\nfunction boucle() {\\n  requestAnimationFrame(boucle);\\n}\\nboucle();\\n\\n\`;
    } else if (i === 50)`
);
fs.writeFileSync('src/data.ts', data);
