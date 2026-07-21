import { Category, Level, Achievement } from './types';

const generateLevels = (categoryId: string, themes: string[], bossTask: string, codeSnippets: Record<number, string> = {}): Level[] => {
  const levels: Level[] = [];
  for (let i = 1; i <= 100; i++) {
    const themeIndex = Math.min(Math.floor((i - 1) / 20), themes.length - 1);
    const theme = themes[themeIndex];
    const levelInTheme = (i - 1) % 20;

    let title = "";
    let description = "";
    let task = "";
    let codeSnippet = "";
    let testCode = "";

    if (levelInTheme === 0) {
      title = `Niveau ${i} : [THÉORIE 1/2] - Base de '${theme}'`;
      description = `Pour démarrer avec le thème "${theme}", tu as besoin de mémoriser des choses (score, position, etc.). On utilise pour ça des variables.\n\nExemple :\nlet vitesse = 10;`;
      task = `Tutoriel : Recopie le code ci-dessous pour déclarer une variable avec 'let' ou 'const'.`;
      testCode = `if (!code.includes('let ') && !code.includes('const ') && !code.includes('var ')) throw new Error('Tutoriel non validé : Déclare une variable avec let ou const.');`;
      codeSnippet = `// ----------------------------------------\n// THÉORIE 1 : État pour ${theme}\n// ----------------------------------------\n// Copie ce code :\nlet position = 0;\n\n`;
    } else if (levelInTheme === 1) {
      title = `Niveau ${i} : [THÉORIE 2/2] - Action de '${theme}'`;
      description = `Maintenant, comment faire vivre ton jeu ? Il faut modifier tes variables ! Par exemple, pour qu'un personnage avance, on change sa position.\n\nExemple :\nposition = position + 5;`;
      task = `Tutoriel (Fin) : Recopie le code ci-dessous pour modifier la valeur d'une variable.`;
      testCode = `if (!code.includes('=')) throw new Error('Tutoriel non validé : Modifie la valeur d\\'une variable (utilise =).');`;
      codeSnippet = `// ----------------------------------------\n// THÉORIE 2 : Logique pour ${theme}\n// ----------------------------------------\n// Copie ce code :\nposition = position + 5;\n\n`;
    } else {
      const challenges = [
        { title: "Mise en place", desc: "Le tutoriel est terminé. À toi de jouer ! Mets en place la structure principale de ton système.", task: "Crée la fonction d'initialisation et les variables globales associées.", test: "if (code.trim().length < 20) throw new Error('Code trop court. Fais un vrai effort de code.');" },
        { title: "Mouvement & Maths", desc: "Nous avons besoin de dynamisme. Applique des transformations ou de l'arithmétique.", task: "Modifie les valeurs avec des opérateurs mathématiques (+, -, *, /) pour créer de l'action.", test: "if (!code.match(/[+\\-*\\/]=/) && !code.match(/[\\w]+[\\+\\-*\\/][\\w\\d]+/)) throw new Error('Utilise des opérateurs mathématiques (+, -, *, /, +=, etc.) pour simuler le comportement.');" },
        { title: "Interactions critiques", desc: "Le jeu doit répondre au joueur ou à l'environnement.", task: "Gère les conditions limites ou les entrées extrêmes (collisions, bordures, out-of-bounds).", test: "if (!code.match(/if\\s*\\(/)) throw new Error('Utilise des conditions strictes (if) pour gérer ces interactions.');" },
        { title: "Refactoring", desc: "Le code commence à être lourd. Rend-le plus propre.", task: "Réfractore ton code. Encapsule ta logique répétitive dans une fonction dédiée.", test: "if (!code.match(/function\\s+[a-zA-Z_]+\\s*\\(/) && !code.match(/[a-zA-Z_]+\\s*=\\s*\\(/) && !code.match(/[a-zA-Z_]+\\s*=\\s*\\w*\\s*=>/)) throw new Error('Crée au moins une fonction nommée pour encapsuler ton code.');" },
        { title: "Rendu & Boucle", desc: "Affiche le résultat de tes calculs de manière fluide.", task: "Utilise le contexte du canvas pour dessiner le résultat ou initie une boucle de rafraîchissement.", test: "if (!code.includes('requestAnimationFrame') && !code.includes('fillRect') && !code.includes('arc') && !code.includes('fillText')) throw new Error('Dessine sur le canvas (fillRect, etc) ou utilise requestAnimationFrame.');" }
      ];

      const challenge = challenges[(levelInTheme - 2) % challenges.length];
      title = `Niveau ${i} : [PRATIQUE] - ${challenge.title}`;
      description = `⚠️ **MODE PRATIQUE : AUCUNE ASSISTANCE** ⚠️\n\nTu es maintenant dans le grand bain pour la thématique '${theme}'.\n\n**Contexte :** ${challenge.desc}\n\nOn ne te donne plus d'exemple à copier. Sers-toi des théories précédentes pour concevoir ta propre logique à partir d'une page blanche.`;
      task = `Mission : ${challenge.task}`;
      testCode = challenge.test;
      codeSnippet = `// ----------------------------------------\n// PRATIQUE SANS AIDE - ${theme}\n// Étape : ${challenge.title}\n// ----------------------------------------\n// Écris ton code à partir de zéro ici :\n\n`;
    }

    if (i === 1) {
      title = `Niveau 1 : [THÉORIE] - Hello World du Jeu Vidéo`;
      description = `Bienvenue dans ta formation de Game Dev ! Avant de commencer, il faut initialiser ton environnement de boucle temporelle.\n\nDans un jeu, tout s'exécute des dizaines de fois par seconde grâce à requestAnimationFrame.`;
      task = `Recopie le code ci-dessous pour créer ta première boucle de jeu.`;
      testCode = `if (!code.includes('requestAnimationFrame')) throw new Error('Utilise requestAnimationFrame pour ta boucle.');`;
      codeSnippet = `// ----------------------------------------\n// HELLO WORLD\n// ----------------------------------------\n// Copie ce code :\nfunction boucle() {\n  requestAnimationFrame(boucle);\n}\nboucle();\n\n`;
    } else if (i === 50) {
      title = `Niveau 50 : [BOSS INTERMÉDIAIRE] - Le point de bascule`;
      description = `Tu es à la moitié du programme ! C'est le moment de complexifier l'architecture de ton code. On oublie les scripts procéduraux.`;
      task = `Refactorise ton architecture pour utiliser au moins une classe ES6 (mot clé class).`;
      testCode = `if (!code.includes('class ')) throw new Error('Utilise le mot-clé class pour passer ce boss.');`;
    } else if (i === 100) {
      title = `Niveau 100 : [PROJET FINAL BOSS]`;
      description = `Le test ultime. Crée la base d'un mini-jeu complet en JS pur. Tu dois concevoir l'interface, la logique et la boucle principale.`;
      task = bossTask;
      testCode = `if (code.length < 150) throw new Error('Ton jeu final doit être beaucoup plus complet ! Fais un effort architectural.');`;
    }

    levels.push({
      id: i,
      title,
      description,
      task,
      testCode,
      codeSnippet: codeSnippets[i] || codeSnippet
    });
  }
  return levels;
};

export const categories: Category[] = [
  {
    id: 'fps',
    name: 'FPS (Tir)',
    description: 'Apprends la 3D, le raycasting, les vecteurs et les calculs spatiaux.',
    iconName: 'Crosshair',
    levels: generateLevels('fps', 
      ["Moteur 3D & Caméra", "Contrôles & Physique", "Armes & Hitscan", "Ennemis & IA", "Optimisation & Shaders"],
      "Crée un mini raycaster (façon Wolfenstein 3D) dans un <canvas>. Le joueur doit pouvoir se déplacer dans un labyrinthe 2D rendu en pseudo-3D et tirer sur une cible."
    )
  },
  {
    id: 'tycoon',
    name: 'Tycoon (Gestion)',
    description: "Maîtrise les boucles économiques, la gestion d'état et les interfaces complexes.",
    iconName: 'Building2',
    levels: generateLevels('tycoon',
      ["Ressources & Variables", "Boucles temporelles (Tick)", "UI & Améliorations", "Événements aléatoires", "Sauvegarde & Équilibrage"],
      "Crée un jeu de type 'Cookie Clicker' complet. Inclus 3 ressources différentes, 5 bâtiments qui génèrent des ressources automatiquement chaque seconde, et un système de sauvegarde locale."
    )
  },
  {
    id: 'precision',
    name: 'Tir de Précision',
    description: 'Physique des projectiles, détection de collisions et feedbacks visuels (Juice).',
    iconName: 'Target',
    levels: generateLevels('precision',
      ["Physique & Gravité", "Collisions & Hitboxes", "Juiciness (Particules & Screenshake)", "Scoring & Combos", "Level Design Dynamique"],
      "Crée un jeu de tir type 'Angry Birds' ou 'Duck Hunt' en JS pur. Utilise la physique pour calculer la trajectoire balistique, ajoute des particules à l'impact et un système de score avec combos."
    )
  },
  {
    id: 'strategy',
    name: 'Stratégie',
    description: 'Algorithmique avancée, pathfinding (A*), et logique de tour par tour.',
    iconName: 'Map',
    levels: generateLevels('strategy',
      ["Génération de Grille", "Pathfinding (A*)", "Sélection & Déplacement d'Unités", "Logique Tour par Tour", "IA de l'Adversaire"],
      "Crée un mini jeu d'échecs ou un Tactical RPG sur une grille 8x8. Implémente l'algorithme A* (A-Star) pour qu'une unité IA poursuive le joueur en évitant des obstacles générés aléatoirement."
    )
  },
  {
    id: 'daily',
    name: 'Défis Quotidiens',
    description: 'Un nouveau défi chaque jour pour garder le rythme et tester tes réflexes de codeur.',
    iconName: 'Calendar',
    levels: [
      {
        id: 1,
        title: "Défi du jour : Particules",
        description: "Crée un effet d'explosion de particules en 2D.",
        task: "Génère 50 particules avec des vélocités aléatoires et applique-leur une gravité.",
        codeSnippet: `function spawnParticles(x, y) {\n  \n}`,
        testCode: `if (!code.includes('for') && !code.includes('Math.random')) throw new Error('Utilise une boucle et de l\\'aléatoire.');`
      },
      {
        id: 2,
        title: "Défi du jour : Shader CRT",
        description: "Code un shader de type CRT (Tube cathodique).",
        task: "Applique un effet de scanline et d'aberration chromatique sur le canvas.",
        codeSnippet: `function applyCRTFilter() {\n  \n}`,
        testCode: `if (!code.includes('getImageData')) throw new Error('Utilise getImageData pour manipuler les pixels.');`
      },
      {
        id: 3,
        title: "Défi du jour : IA Ennemie",
        description: "Programme une IA simple qui patrouille.",
        task: "L'ennemi doit avancer jusqu'à un mur, puis faire demi-tour automatiquement.",
        codeSnippet: `function updateEnemy(enemy) {\n  \n}`,
        testCode: `if (!code.match(/if\\s*\\(/) && !code.match(/=\\s*-/)) throw new Error('Inverse la vitesse si l\\'ennemi touche un mur.');`
      },
      {
        id: 4,
        title: "Défi du jour : Parallaxe",
        description: "Ajoute un effet de parallaxe avec 3 calques de fond.",
        task: "Déplace les 3 calques à des vitesses différentes en fonction de la position du joueur pour créer une illusion de profondeur.",
        codeSnippet: `function updateParallax(playerX) {\n  \n}`,
        testCode: `if (!code.match(/\\*/)) throw new Error('Multiplie la position par un ratio pour la parallaxe.');`
      },
      {
        id: 5,
        title: "Défi du jour : Éclairage",
        description: "Programme un système de ligne de vue (Line of Sight).",
        task: "Rends les ennemis visibles uniquement s'ils sont dans un cône de vision de 45 degrés devant le joueur.",
        codeSnippet: `function calculateLighting(player, enemies) {\n  \n}`,
        testCode: `if (!code.includes('Math.atan2')) throw new Error('Utilise atan2 pour calculer les angles.');`
      }
    ]
  },
  {
    id: 'secret',
    name: 'Boss Final',
    description: "Le test ultime : code ton propre jeu de A à Z.",
    iconName: 'Crown',
    levels: [
      {
        id: 1,
        title: "Projet Final : Jeu Complet",
        description: "Tu as appris toutes les bases. Il est temps de concevoir ton propre mini-jeu de toutes pièces. Architecture, logique, rendu, et juice : tout repose sur tes épaules.",
        task: "Crée un mini-jeu complet en JS pur. Tu dois concevoir l'interface, la logique de boucle principale et la jouabilité.",
        codeSnippet: `// ----------------------------------------\n// PROJET FINAL - JEU COMPLET\n// ----------------------------------------\n// Écris ton jeu à partir de zéro ici :\n\n`,
        testCode: `if (code.length < 300) throw new Error('Ton jeu final doit être beaucoup plus complet !');`
      }
    ]
  }
];

export const achievements: Achievement[] = [
  { id: 'first_blood', title: 'First Blood', description: 'Termine ton premier niveau.', iconName: 'Star' },
  { id: 'apprentice', title: 'Apprenti Codeur', description: 'Termine 10 niveaux.', iconName: 'Award' },
  { id: 'master', title: 'Maître Architecte', description: 'Termine 100 niveaux.', iconName: 'Crown' },
  { id: 'streak_3', title: 'Régulier', description: 'Accomplis 3 défis quotidiens.', iconName: 'Flame' },
  { id: 'fps_master', title: 'Sniper', description: 'Termine la catégorie FPS.', iconName: 'Crosshair' },
  { id: 'tycoon_master', title: 'Capitaliste', description: 'Termine la catégorie Tycoon.', iconName: 'Building2' }
];
