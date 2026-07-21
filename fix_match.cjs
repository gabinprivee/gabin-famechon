const fs = require('fs');
let data = fs.readFileSync('src/data.ts', 'utf8');

data = data.replace(
  `test: "if (!code.match(/[+\\\\-*\\\\/]=/) && !code.match(/[\\\\w]+[\\\\+\\\\-*\\\\/][\\\\w\\\\d]+/)) throw new Error('Utilise des opérateurs mathématiques (+, -, *, /, +=, etc.) pour simuler le comportement.');"`,
  `test: "if (!code.includes('+') && !code.includes('-') && !code.includes('*') && !code.includes('/')) throw new Error('Utilise des opérateurs mathématiques (+, -, *, /, +=, etc.) pour simuler le comportement.');"`
);

data = data.replace(
  `test: "if (!code.match(/if\\\\s*\\\\(/)) throw new Error('Utilise des conditions strictes (if) pour gérer ces interactions.');"`,
  `test: "if (!code.includes('if')) throw new Error('Utilise des conditions strictes (if) pour gérer ces interactions.');"`
);

data = data.replace(
  `test: "if (!code.match(/function\\\\s+[a-zA-Z_]+\\\\s*\\\\(/) && !code.match(/[a-zA-Z_]+\\\\s*=\\\\s*\\\\(/) && !code.match(/[a-zA-Z_]+\\\\s*=\\\\s*\\\\w*\\\\s*=>/)) throw new Error('Crée au moins une fonction nommée pour encapsuler ton code.');"`,
  `test: "if (!code.includes('function') && !code.includes('=>')) throw new Error('Crée au moins une fonction nommée pour encapsuler ton code.');"`
);

data = data.replace(
  "testCode: `if (!code.match(/if\\\\s*\\\\(/) && !code.match(/=\\\\s*-/)) throw new Error('Inverse la vitesse si l\\\\'ennemi touche un mur.');`",
  "testCode: `if (!code.includes('if')) throw new Error('Inverse la vitesse si l\\\\'ennemi touche un mur.');`"
);

data = data.replace(
  "testCode: `if (!code.match(/\\\\*/)) throw new Error('Multiplie la position par un ratio pour la parallaxe.');`",
  "testCode: `if (!code.includes('*')) throw new Error('Multiplie la position par un ratio pour la parallaxe.');`"
);

fs.writeFileSync('src/data.ts', data);
