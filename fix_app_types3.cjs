const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  /reduce<number\[\]>\(\(acc, val\) => acc\.concat\(val \|\| \[\]\), \[\]\)/g,
  "reduce((acc: number[], val: any) => acc.concat(val || []), [])"
);

fs.writeFileSync('src/App.tsx', app);
