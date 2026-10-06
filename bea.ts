import fs from 'fs/promises';
import path from 'path';
import fsExists from 'fs.promises.exists';
import lineReader from 'line-reader';
import readlineSync from 'readline-sync'
import seedrandom from 'seedrandom';

const beadirPath = './have fun spanier';
const prevBeasFilePath = "./previousBeas.txt";
const beaDate = new Date().toISOString().split('T')[0] //timezone of user?!
const beaGenerator = seedrandom(beaDate);

let prevBeas = Array();
let savedBeaDate = await fs.readFile("./lastBeaDate", 'utf-8');
let beaFolders = await fs.readdir(beadirPath);
beaFolders.sort();

if (await fsExists(prevBeasFilePath)){
  const beaFileContent = await fs.readFile(prevBeasFilePath, 'utf-8');
  const beaLines = beaFileContent.split('\n');
  for (const beaLine of beaLines)
    if (beaLine != "")
      prevBeas.push(beaLine);
}

console.log(prevBeas);

if (savedBeaDate != beaDate) {
  let beaImagePath: string = await chooseToBea();
  console.log(beaImagePath);
  await fs.writeFile("previousBeas.txt", "");
  for (let i = 0; i < prevBeas.length; i++)
    fs.appendFile(prevBeasFilePath, prevBeas[i].toString() + "\n");
  fs.writeFile("lastBeaDate", beaDate);
}
console.log(savedBeaDate);
console.log(beaDate);


async function chooseToBea():Promise<string>{
  let beaImageNumber: number = 0;
  let beaImageAmount: number = await getBeaAmount(beaFolders);
  console.log("2nd to last");
  beaImageNumber = await findNewBeaNumber(beaImageAmount);
  if (prevBeas.length < 10)
    prevBeas[prevBeas.length] = beaImageNumber;
  else {
    prevBeas.pop();
    prevBeas.unshift(beaImageNumber);
  }
  console.log("its the last");
  return await getBeaFilePath(beaFolders, beaImageNumber);
}

async function getBeaFilePath(beaFolders: string[], beaImageNumber: number): Promise<string>{
  let beaImagePath: string = "";
  for (let i = 0; i < beaFolders.length; i++){
    let beaFolder = await fs.readdir(beadirPath + "/" + beaFolders[i]);
    if (((beaImageNumber - beaFolder.length) <= 0)) {
      beaImagePath = beadirPath + "/" + beaFolders[i] + "/" + beaFolder[beaImageNumber-1];
      break;
    }
    beaImageNumber -= beaFolder.length;
  }
  return beaImagePath;
}

async function findNewBeaNumber(beaImageAmount:number): Promise<number>{
  let beawNumberFound: boolean = false;
  let beaImageNumber: number = 0;
  while (!beawNumberFound) {
    beaImageNumber = getRandomBeaint(1, beaImageAmount);
    beawNumberFound = true;
    for (let i = 0; i < prevBeas.length; i++){
      if (beaImageNumber == prevBeas[i]) {
        beawNumberFound = false
        break;
      }
    }
  }
  return beaImageNumber;
}

async function getBeaAmount(beaFolders: string[]): Promise<number>{
  let beaImageAmount: number = 0;
  for (let i = 0; i < beaFolders.length; i++){
    let beaFolder = await fs.readdir(beadirPath + "/" + beaFolders[i]);
    //imageAmountPerFolder.push(folder.length);
    beaImageAmount += beaFolder.length;
  }
  return beaImageAmount;
}

function getRandomBeaint(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(beaGenerator() * (max - min + 1)) + min;
}
