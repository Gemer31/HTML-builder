const fs = require('fs');
const path = require('path');
const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.promises.readdir(secretFolderPath, {withFileTypes: true})
  .then(data => {
    data.forEach(item => {
      const filePath = path.join(secretFolderPath, item.name);
      const fileNameData = item.name.split('.');

      item.isFile() && fs.stat(filePath, (err, stats) =>
        console.log(`${fileNameData[0]} - ${fileNameData[1]} - ${stats.size} bytes`)
      )
    });
  });
