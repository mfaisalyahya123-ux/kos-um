const fs = require('fs');
let g = fs.readFileSync('generate.js', 'utf8');

// 1. Fix .container overflow: hidden → overflow: visible
const oldContainer = `border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;`;

const newContainer = `border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: visible;`;

if (g.includes(oldContainer)) {
    g = g.replace(oldContainer, newContainer);
    console.log('1. Fixed container overflow');
} else {
    console.log('1. container not found');
}

// 2. Fix .category-card overflow (if exists)
const oldCard = `border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            overflow: hidden;`;

const newCard = `border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            overflow: visible;`;

if (g.includes(oldCard)) {
    g = g.replace(oldCard, newCard);
    console.log('2. Fixed category-card overflow');
} else {
    console.log('2. category-card overflow not found');
}

// 3. Add padding-bottom to body
const oldBody = `padding: 20px;
            min-height: 100vh;`;

const newBody = `padding: 20px;
            padding-bottom: 100px;
            min-height: 100vh;`;

if (g.includes(oldBody)) {
    g = g.replace(oldBody, newBody);
    console.log('3. Added padding-bottom to body');
} else {
    console.log('3. body padding not found');
}

// 4. Fix category-breakdown grid - add overflow-y: auto
const oldGrid = `display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;`;

const newGrid = `display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
            overflow-y: auto;`;

if (g.includes(oldGrid)) {
    g = g.replace(oldGrid, newGrid);
    console.log('4. Added overflow-y to category-breakdown');
} else {
    console.log('4. category-breakdown grid not found');
}

fs.writeFileSync('generate.js', g);
console.log('Done!');
