const fs = require('fs');
let data = fs.readFileSync('src/data.ts', 'utf8');

// Fix challenge test strings (inside double quotes)
data = data.replace(/test:\s*"([^"]+)"/g, (match, p1) => {
  // We need to properly escape backslashes.
  // The original string has single backslashes, which we want to turn into double backslashes in the output JS file.
  // Wait, if we read the file, the backslashes are literal backslashes in the source.
  let fixed = p1.replace(/\\/g, '\\\\');
  return `test: "${fixed}"`;
});

// Fix template literals for testCode
data = data.replace(/testCode:\s*`([^`]+)`/g, (match, p1) => {
  let fixed = p1.replace(/\\/g, '\\\\');
  return `testCode: \`${fixed}\``;
});

// Fix other template literal testCodes in the loop
data = data.replace(/testCode\s*=\s*`([^`]+)`/g, (match, p1) => {
  let fixed = p1.replace(/\\/g, '\\\\');
  return `testCode = \`${fixed}\``;
});

fs.writeFileSync('src/data.ts', data);
