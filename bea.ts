//edge case? what if the generator pulls image with id on the 10th spot
// it gets pushed out but the program crashes, now it reloads and the seed puts in the new first timezone
// actually maybe nvm because date didnt change


import fs from 'fs/promises';
import fsExists from 'fs.promises.exists';
import seedrandom from 'seedrandom';
import crypto from 'crypto';
import sharp from 'sharp';

const beadirPath = './have fun spanier';
const prevBeasFilePath = "./previousBeas.txt";
const beaDate = new Date().toISOString().split('T')[0] //timezone of user?!
const beaGenerator = seedrandom(beaDate);

let prevBeas = Array();
let savedBeaDate = await fs.readFile("./lastBeaDate", 'utf-8');
let beaFolders = await fs.readdir(beadirPath);
let beaImagePath: string = "";
let beaImageName: string = "";
beaFolders.sort();

if (await fsExists(prevBeasFilePath)) {
  const beaFileContent = await fs.readFile(prevBeasFilePath, 'utf-8');
  const beaLines = beaFileContent.split('\n');
  let hasDate: boolean = false;
  for (const beaLine of beaLines)
    if (beaLine != "") {
      if (!hasDate){
        savedBeaDate = beaLine;
        hasDate = true;
      }
        else prevBeas.push(beaLine);
    }
}

console.log(prevBeas);

if (savedBeaDate != beaDate) {
  beaImageName = await chooseToBea();
  const beaFileContent = beaDate + "\n" + prevBeas.join("\n") + "\n";
  await fs.writeFile("previousBeas.txt", beaFileContent);
} else {
  beaImageName = prevBeas[0];
}
beaImagePath = beadirPath + "/" + beaImageName;

console.log(savedBeaDate);
console.log(beaDate);
console.log(beaImagePath);
console.log(beaImageName);
console.log(crypto.createHash('md5').update(beaImageName).digest('hex'));
let image = await loadBeaImage(beaImagePath);


async function loadBeaImage(beaPath: string) {
  try {
    const beaImage = await sharp(beaPath).toBuffer();
    return beaImage;
  } catch (error) {
    console.error("buh");
  }
}

async function chooseToBea():Promise<string>{
  let beaImageAmount: number = await getBeaAmount(beaFolders);
  let beaName = await findNewBea(beaImageAmount);
  console.log(beaName);
  prevBeas.unshift(beaName);
  if (prevBeas.length > 10)
    prevBeas.pop();
  return beaName;
}

async function getBeaFileName(beaFolders: string[], beaImageNumber: number): Promise<string>{
  let beaFileName:string = "";
  for (let i = 0; i < beaFolders.length; i++){
    let beaFolder = await fs.readdir(beadirPath + "/" + beaFolders[i]);
    if (((beaImageNumber - beaFolder.length) <= 0)) {
      beaFileName = beaFolders[i] + "/" + beaFolder[beaImageNumber - 1];
      break;
    }
    beaImageNumber -= beaFolder.length;
  }

  return beaFileName;
}

async function findNewBea (beaImageAmount:number): Promise<string>{
  let beaFound: boolean = false;
  let beaImageNumber: number = getRandomBeaint(1, beaImageAmount);
  let beaFileName = await getBeaFileName(beaFolders, beaImageNumber);
  while (!beaFound) {
    beaFound = true;
    for (let i = 0; i < prevBeas.length; i++){
      beaFileName = await getBeaFileName(beaFolders, beaImageNumber);
      if (beaFileName == prevBeas[i]) {
        beaFound = false
        beaImageNumber = getRandomBeaint(1, beaImageAmount);
        break;
      }
    }
  }
  return beaFileName;
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
