const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

function fetchFileContent(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function saveFile(file, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, content, 'utf-8', err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

async function generateFileTree(directory) {
  let idCounter = 0;

  function generateId() {
    return `ftn_${idCounter++}`;
  }

  async function buildTree(currentDir, relativePath = '') {
    const files = await fsp.readdir(currentDir);
    const children = [];

    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const rp = path.join(relativePath, file);
      const stat = await fsp.stat(filePath);

      if (stat.isDirectory()) {
        const subTree = await buildTree(filePath, rp);
        children.push({
          id: generateId(),
          relativePath: rp,
          name: file,
          type: 'dir',
          children: subTree,
        });
      } else {
        children.push({
          id: generateId(),
          relativePath: rp,
          name: file,
          type: 'file',
        });
      }
    }

    return children;
  }

  const tree = await buildTree(directory);
  return tree;
}

module.exports = {
  fetchFileContent,
  saveFile,
  generateFileTree,
};
