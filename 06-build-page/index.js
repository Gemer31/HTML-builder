const fs = require('fs');
const path = require('path');
const {readdir, readFile, mkdir, rm} = require('fs/promises');
const projectDistPath = path.join(__dirname, 'project-dist');

(async function () {
  await rm(projectDistPath, {force: true, recursive: true})
  await mkdir(projectDistPath);

  createStyles();
  createTemplate();
  copyFiles(path.join(__dirname, "assets"), path.join(projectDistPath, "assets"));
})()

async function createStyles() {
  try {
    const stylesFolderPath = path.join(__dirname, 'styles');
    const writeStream = fs.createWriteStream(path.join(projectDistPath, 'style.css'));

    const folderData = await readdir(stylesFolderPath, {withFileTypes: true});
    const cssFiles = folderData.filter(item => item.isFile() && item.name.includes('.css'));

    for (const file of cssFiles) {
      const fileData = await readFile(path.join(stylesFolderPath, file.name));
      await writeStream.write(fileData);
    }
  } catch (e) {
    console.log('Error: ', e.message);
  }
}

async function createTemplate() {
  const componentsPath = path.join(__dirname, 'components');
  const componentFiles = await readdir(componentsPath, {withFileTypes: true});
  const templateData = await readFile(path.join(__dirname, 'template.html'));
  let htmlContent = templateData.toString();

  for (const file of componentFiles) {
    const fileData = await readFile(path.join(componentsPath, file.name));
    htmlContent = htmlContent.replaceAll(`{{${file.name.split('.')[0]}}}`, fileData.toString());
  }

  await fs.createWriteStream(path.join(projectDistPath, 'index.html'))
          .write(htmlContent);
}

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

