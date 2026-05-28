const fs = require('fs');
let g = fs.readFileSync('generate.js', 'utf8');

// Find exact position
const idx = g.indexOf('// Collapsible functionality for Category cards');
console.log('Found at:', idx);
// Show what's before
const before = g.substring(idx - 250, idx);
console.log('Before:', JSON.stringify(before.substring(before.length - 100)));

// Insert handler right before the Category cards comment
const handler = `        // Collapsible functionality for inner Date sections
        var dateInnerColl = document.getElementsByClassName("date-inner-collapsible");
        for (var i = 0; i < dateInnerColl.length; i++) {
            dateInnerColl[i].addEventListener("click", function() {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                content.classList.toggle("active");
            });
        }

`;

g = g.substring(0, idx) + handler + g.substring(idx);
fs.writeFileSync('generate.js', g);
console.log('Inserted handler');