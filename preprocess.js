const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function createIndexFile(textFilePath) {
  let lineOffset = [];
  let offset = 0;

  // Determine the base name of the text file and construct the index file name
  const baseName = path.basename(textFilePath, path.extname(textFilePath));
  const indexFilePath = path.join(path.dirname(textFilePath), `${baseName}.index.json`);

  const fileStream = fs.createReadStream(textFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    lineOffset.push(offset);
    // Include the newline character length to the offset
    offset += Buffer.byteLength(line + "\n");
  }

  // Ensure the write operation completes successfully
  fs.writeFileSync(indexFilePath, JSON.stringify(lineOffset));
  // console.log(`Index file created at ${indexFilePath}`);
}

async function preprocess() {
  const textFilePath = process.env.FILE_TO_SERVE;

  if (!textFilePath) {
    console.log('The FILE_TO_SERVE environment variable is not set.');
    process.exit(1);
  }

  try {
    await createIndexFile(textFilePath);
    console.log(`Index file created for ${textFilePath}`);
  } catch (error) {
    console.error('Error creating index file:', error);
    process.exit(1);
  }
}

preprocess();