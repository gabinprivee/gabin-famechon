const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  /reduce\(\(acc: number\[\], val: number\[\]\) => acc\.concat\(val \|\| \[\]\), \[\]\)/g,
  "reduce<number[]>((acc, val) => acc.concat(val || []), [])"
);

fs.writeFileSync('src/App.tsx', app);
