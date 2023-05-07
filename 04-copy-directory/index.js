const path = require('path')
const {readdir, readFile, mkdir, rm} = require('fs/promises');
const fs = require('fs');

const filesPath = path.join(__dirname, 'files');
const filesCopyPath = path.join(__dirname, 'files-copy');

(async function () {
  try {
    await rm(filesCopyPath, {force: true, recursive: true})
    await mkdir(filesCopyPath);

    const files = await readdir(filesPath, {withFileTypes: true});

    for (const file of files) {
      const fileData = await readFile(path.join(filesPath, file.name));
      const fileCopyWriteStream = fs.createWriteStream(path.join(__dirname, 'files-copy', file.name))
      await fileCopyWriteStream.write(fileData);
    }

    console.log("Files copied successfully!");
  } catch (e) {
    console.log('Error: ', e.message);
  }
})();