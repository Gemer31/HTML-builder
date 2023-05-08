const path = require('path')
const {readdir, readFile, mkdir, rm} = require('fs/promises');
const fs = require('fs');

(async function () {
  await rm(path.join(__dirname, 'files-copy'), {force: true, recursive: true})
  copyFiles(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
})()

async function copyFiles(copyPath, destinationPath) {
  try {
    await mkdir(destinationPath);
    const files = await readdir(copyPath, {withFileTypes: true});

    for (const file of files) {
      if (file.isDirectory()) {
        await copyFiles(path.join(copyPath, file.name), path.join(destinationPath, file.name))
      } else {
        const fileData = await readFile(path.join(copyPath, file.name));
        const fileCopyWriteStream = fs.createWriteStream(path.join(destinationPath, file.name))
        await fileCopyWriteStream.write(fileData);
      }
    }
  } catch (e) {
    console.log('Error: ', e.message);
  }
}
