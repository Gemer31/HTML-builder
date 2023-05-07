const {stdin, stdout, exit} = process;
const fs = require('fs');
const path = require('path');
const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Hi, my dear friend! Write something, please\n');
stdin.on('data', data => {
  const inputText = data.toString().trim();
  inputText === 'exit' ? exit() : writeStream.write(inputText);
});

process.on('SIGINT', () => exit());
process.on('exit', () => console.log('bye =)'));
