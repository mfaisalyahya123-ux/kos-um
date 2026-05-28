const h = require('fs').readFileSync('index.html', 'utf8');
console.log('Has inner JS:', h.includes('date-inner-collapsible'));
// Check JS section
const idx = h.lastIndexOf('date-inner-collapsible');
console.log('Last ref at:', idx);
console.log(h.substring(idx - 30, idx + 100));
// Check for handler
console.log('Has getElementsByClassName inner:', h.includes('date-inner'));