const fs = require('fs');
const path = require('path');

const directory = '../dist';

fs.rm(path.join(__dirname, directory), { recursive: true, force: true }, (err) => {
    if (err) {
        console.error(`Error while cleaning the ${directory} directory:`, err);
    } else {
        console.log(`${directory} directory is cleaned`);
    }
});
