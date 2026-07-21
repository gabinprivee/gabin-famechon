const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  /reduce\(\(acc: number\[\], val: any\) => acc\.concat\(val \|\| \[\]\), \[\]\)/g,
  "flatMap((val: any) => val || [])"
);

fs.writeFileSync('src/App.tsx', app);
