const filelistURL =
  "https://raw.githubusercontent.com/swith-wiz-kev/git_test/main/filelist2.txt";
let myArray = [];

function File(fileName, folderName, youtubeUrl) {
  this.fileName = fileName;
  this.folderName = folderName;
  this.youtubeUrl = youtubeUrl;
}

async function readFile() {
  const response = await fetch(filelistURL);
  const result = await response.text();
  return result;
}

/* function removeNonStayc(fullText) {
  return fullText.slice(2683206 + 44, 3014287 - 3);
} */

function readLines(fullText) {
  return fullText.split("\n");
}

function getFolderName(deeperSplitArray) {
  let folderName = "";
  for (let index = 1; index < deeperSplitArray.length - 1; index++) {
    folderName = folderName + deeperSplitArray[index] + "/";
  }
  return folderName;
}

function getYoutubeUrl(fileName) {
  const closeBracketIndex = fileName.lastIndexOf("]");
  const openBracketIndex = fileName.lastIndexOf("[");
  if (fileName.lastIndexOf(".vtt") > 1) {
    return "";
  } else if (closeBracketIndex - openBracketIndex == 12) {
    const youtubeVideoCode = fileName.slice(
      openBracketIndex + 1,
      closeBracketIndex
    );
    return "https://www.youtube.com/watch?v=" + youtubeVideoCode;
  } else return "";
}

// printTargetFolders();
// printYoutubeUrl();
// groupYoutubeUrl();
// printYoutubedownloaderCode();

function processText(fullText) {
  const splitTextArray = readLines(fullText);
  for (let index = 0; index < splitTextArray.length-1; index++) {
    const splitText = splitTextArray[index];
    const deeperSplitArray = splitText.split("\\");
    const fileName = deeperSplitArray[deeperSplitArray.length - 1];
    const folderName = getFolderName(deeperSplitArray);
    const youtubeUrl = getYoutubeUrl(fileName);
    const newFile = new File(fileName, folderName, youtubeUrl);
    myArray.push(newFile);
  }
}

function encodeString(string) {
  let encodedString = "";
  for (let index = 0; index < string.length; index++) {
    charCode = string.charCodeAt(index).toString();
    encodedString = encodedString + charCode + "-";
  }
  return encodedString;
}

function decodeString(string) {
  let decodedString = "";
  const charArray = string.split("-");
  for (let index = 0; index < charArray.length - 1; index++) {
    decodedString += String.fromCharCode(parseInt(charArray[index]));
  }
  return decodedString;
}

function createDiv(divClass, folderName) {
  const mainDiv = document.querySelector(".maingrid");
  const div = document.createElement("div");
  div.classList.add("c" + divClass);
  div.classList.add("foldernames");
  div.textContent = folderName;
  const downloadCodeDiv = document.createElement("p");
  downloadCodeDiv.classList.add("downloadcodes");
  downloadCodeDiv.textContent =
    '-o "' + folderName + '%(title)s [%(id)s].%(ext)s" ';
  div.appendChild(downloadCodeDiv);
  mainDiv.appendChild(div);
}

function createFolder(folderName) {
  const folderNameEncoded = encodeString(folderName);
  const isCreated = document.querySelector(".c" + folderNameEncoded);
  if (isCreated === null) {
    createDiv(folderNameEncoded, folderName);
  }
}

function addFile(fileName, folderName, youtubeUrl) {
  const folderNameEncoded = encodeString(folderName);
  targetSubFolder = document.querySelector(".c" + folderNameEncoded);
  if (youtubeUrl == "") {
    const textOnly = document.createElement("li");
    textOnly.textContent = fileName;
    targetSubFolder.appendChild(textOnly);
  } else {
    const link = document.createElement("a");
    link.textContent = fileName;
    link.href = youtubeUrl;
    targetSubFolder.appendChild(link);
  }
}

function addDownloadCode(youtubeUrl, folderName) {
  if (youtubeUrl == "") {
  } else {
    const folderNameEncoded = encodeString(folderName);
    targetTextArea = document.querySelector(
      ".c" + folderNameEncoded + ">.downloadcodes"
    );
    targetTextArea.textContent += youtubeUrl + " ";
  }
}

function printLibrary(myArray) {
  for (let index = 0; index < myArray.length; index++) {
    createFolder(myArray[index].folderName);
    addFile(
      myArray[index].fileName,
      myArray[index].folderName,
      myArray[index].youtubeUrl
    );
    addDownloadCode(myArray[index].youtubeUrl, myArray[index].folderName);
  }
}

readFile().then((value) => {
  processText(value);
  printLibrary(myArray);
});
