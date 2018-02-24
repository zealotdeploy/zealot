/* eslint-disable no-underscore-dangle */
const fs = jest.genMockFromModule("fs");

const mockFiles = [];

function __setMockFiles(newMockFiles) {
  Object.keys(newMockFiles).forEach(file => {
    mockFiles.push({
      name: file,
      content: newMockFiles[file],
    });
  });
}

function existsSync(directoryPath) {
  return mockFiles.some(file => file.name === directoryPath);
}

function readFileSync(filename) {
  return mockFiles.find(file => file.name === filename).content;
}

fs.__setMockFiles = __setMockFiles;
fs.existsSync = existsSync;
fs.readFileSync = readFileSync;

export default fs;
