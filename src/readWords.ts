const fs = require('fs');
const path = require('path');

export const processLineByLine = (fileName: string): string[] => {
    const filePath = path.join(__dirname, `../text/${fileName}`);
    console.log(`Attempting to open and read: ${filePath}`);
    const text: string = fs.readFileSync(filePath).toString();
    console.log('Successfully read file');
    return text.split('\n');
};
