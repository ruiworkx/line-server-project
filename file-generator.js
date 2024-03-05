const fs = require('fs');
const path = require('path');

function duplicateFileContent(originalFilePath, newFilePath, numRepetitions) {
  fs.readFile(path.join(__dirname, originalFilePath), { encoding: 'utf-8' }, (err, content) => {
    if (err) {
      console.error('Error reading the original file:', err);
      return;
    }
    
    const stream = fs.createWriteStream(path.join(__dirname, newFilePath), { flags: 'w' });
    for (let i = 0; i < numRepetitions; i++) {
      stream.write(content);
    }
    
    stream.end();
  });
}

// Example usage: Duplicate the content of 'original.txt' 1000 times into 'largerfile.txt'
duplicateFileContent('6mbfile.txt', 'largerfile.txt', 100);