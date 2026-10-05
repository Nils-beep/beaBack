import fs from 'fs/promises';
import path from 'path';

const dirPath = './have fun spanier';

let chosenImages = new Array();

let imagePath:string = await chooseToBea();
console.log(imagePath);

async function chooseToBea():Promise<string>{
  let folderAmount: number;
  let randomFolder: number;
  let imagePath: string;
  let files = await fs.readdir(dirPath);
  let imageAmountPerFolder = new Array();
  let imageAmount: number = 0;
  for (let i = 0; i < files.length; i++){
    let folder = await fs.readdir(dirPath + "/" + files[i]);
    imageAmountPerFolder.push(folder.length);
    imageAmount += folder.length;
  }
  console.log(imageAmount);
  folderAmount = files.length;
  randomFolder = getRandomInt(0, folderAmount - 1);
  let imageFolderPath = dirPath + "/" +files[randomFolder];
  let folderFiles = await fs.readdir(imageFolderPath);
  imagePath = imageFolderPath + "/" + folderFiles[getRandomInt(0, folderFiles.length - 1)];
  return imagePath;
}

function getRandomInt(min:number, max:number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
