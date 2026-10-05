import fs from 'fs/promises';
import path from 'path';
import fsExists from 'fs.promises.exists';
import lineReader from 'line-reader';
import readlineSync from 'readline-sync'

const dirPath = './have fun spanier';
const prevBeasFilePath = "./previousBeas.txt";

let prevBeas = Array();

if (await fsExists("./previousBeas.txt")){
  const fileContent = await fs.readFile(prevBeasFilePath, 'utf-8');
  const lines = fileContent.split('\n');
  for (const line of lines)
    if (line != "")
      prevBeas.push(line);
}

console.log(prevBeas);
let imagePath: string = await chooseToBea();
console.log(imagePath);
await fs.writeFile("previousBeas.txt", "");
for (let i = 0; i < prevBeas.length; i++)
  fs.appendFile(prevBeasFilePath, prevBeas[i].toString()+"\n");


async function chooseToBea():Promise<string>{
  let imagePath: string = '';
  let folders = await fs.readdir(dirPath);
  let imageAmountPerFolder = new Array();
  let imageAmount: number = 0;
  for (let i = 0; i < folders.length; i++){
    let folder = await fs.readdir(dirPath + "/" + folders[i]);
    imageAmountPerFolder.push(folder.length);
    imageAmount += folder.length;
  }

  folders.sort();
  let newNumberFound: boolean = false;
  let imageNumber: number = 0;
  while (!newNumberFound) {
    imageNumber = getRandomBeaint(1, imageAmount);
    newNumberFound = true;
    for (let i = 0; i < prevBeas.length; i++){
      if (imageNumber == prevBeas[i]) {
        newNumberFound = false
        break;
      }
    }
  }
  prevBeas[prevBeas.length] = imageNumber;
  //fs.appendFile(prevBeasFilePath, imageNumber.toString()+"\n");
  for (let i = 0; i < folders.length; i++){
    let folder = await fs.readdir(dirPath + "/" + folders[i]);
    if (((imageNumber - folder.length) <= 0)) {
      imagePath = dirPath + "/" + folders[i] + "/" + folder[imageNumber-1];
      break;
    }
    imageNumber -= folder.length;
  }
  return imagePath;
}


function getRandomBeaint(min:number, max:number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
