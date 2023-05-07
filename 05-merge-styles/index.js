const fs = require('fs');
const path = require('path');
const {readdir, readFile} = require('fs/promises');

const stylesFolderPath = path.join(__dirname, 'styles');
const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

(async function () {
  try {
    const folderData = await readdir(stylesFolderPath, {withFileTypes: true});
    const cssFiles = folderData.filter(item => item.isFile() && item.name.includes('.css'));

    for (const file of cssFiles) {
      const fileData = await readFile(path.join(stylesFolderPath, file.name));
      await writeStream.write(fileData);
    }

    console.log("Styles bundle created successfully!");
  } catch (e) {
    console.log('Error: ', e.message);
  }
})();
