const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// const textFilePath = 'largerfile.txt';
// const indexFilePath = 'largerfile.index.json';

// Use the FILE_TO_SERVE environment variable to determine the file paths
const textFilePath = process.env.FILE_TO_SERVE;
const baseName = path.basename(textFilePath, path.extname(textFilePath));
const indexFilePath = path.join(path.dirname(textFilePath), `${baseName}.index.json`);

let lineOffset;
try {
  // Read the index file into memory
  lineOffset = JSON.parse(fs.readFileSync(indexFilePath));
} catch (error) {
  console.error('Error reading index file:', error);
  process.exit(1);
}

app.get('/lines/:lineIndex', (req, res) => {
  const lineIndex = parseInt(req.params.lineIndex, 10);

  // Check if lineIndex is a valid number
  if (isNaN(lineIndex)) {
    return res.status(400).send('Invalid line index.');
  }

  // console.log(lineOffset.length);
  
  if (lineIndex < 0 || lineIndex >= lineOffset.length) {
    return res.status(413).send('Requested line is out of bounds.');
  }

  const start = lineOffset[lineIndex];
  let end;
  if (lineIndex + 1 < lineOffset.length) {
    // Subtract 1 only if it is not the last line, to avoid including the first character of the next line
    // else 'end' is left as undefined to read till the end of the file
    end = lineOffset[lineIndex + 1] - 1;
  }

  // Create a read stream from the start of the requested line to the start of the next
  const stream = fs.createReadStream(textFilePath, {start, end});
  stream.pipe(res);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});