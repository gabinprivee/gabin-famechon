const fs = require('fs');
let data = fs.readFileSync('src/data.ts', 'utf8');

data = data.replace(
  /throw new Error\('Tutoriel non validé : Modifie la valeur d\\\\'une variable \(utilise =\)\.'\);/g,
  "throw new Error(\"Tutoriel non validé : Modifie la valeur d'une variable (utilise =).\");"
);

data = data.replace(
  /throw new Error\('Utilise une boucle et de l\\\\'aléatoire\.'\);/g,
  "throw new Error(\"Utilise une boucle et de l'aléatoire.\");"
);

data = data.replace(
  /throw new Error\('Inverse la vitesse si l\\\\'ennemi touche un mur\.'\);/g,
  "throw new Error(\"Inverse la vitesse si l'ennemi touche un mur.\");"
);

fs.writeFileSync('src/data.ts', data);
