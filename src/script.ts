const colorCodeList: string[] = [
  '<span style = "background-color:#da1552">',
  '<span style = "background-color:#96c958">',
  '<span style = "background-color:#1ba9d7">',
  '<span style = "background-color:#f6f880">',
  '<span style = "background-color:#e8d4c6">',
  '<span style = "background-color:#006400">',
  '<span style = "background-color:#da1552">',
  '<span style = "background-color:#d98240">',
  '<span style = "background-color:#c71585">',
  '<span style = "background-color:#3cb371">',
];

const capitalize = (sentence: string): string => {
  return sentence.toUpperCase();
};

const formatWord = (word: string): string => {
  word = word.replace(",", "");
  word = word.replace(".", "");
  word = word.replace("!", "");
  word = word.replace("?", "");
  word = word.replace("(", "");
  word = word.replace(")", "");
  return word;
};

const applyColor = (
  word: string,
  count: number,
  accentSyllable: string,
  accentSyllableList: string[]
): string => {
  word =
    colorCodeList[
      (accentSyllableList.indexOf(accentSyllable) + count) %
        colorCodeList.length
    ] +
    word +
    "</span>";
  return word;
};

const createNotFoundWordList = (wordList: string[]): string => {
  let header;
  if (wordList.length === 1) {
    header = "<h3>Word that couldn't be found in the dictionary</h3>";
  } else {
    header = "<h3>Words that couldn't be found in the dictionary</h3>";
  }
  return header + wordList.join(", ");
};

const checkSingleLineRhyme = (): string[][] => {
  let count = 0;

  let text: string = (<HTMLInputElement>document.getElementById("verse")).value;
  //Remove multiple spaces in a row
  text = text.replace(/^\s+|\s+$/g, "").replace(/ +/g, " ");

  let accentSyllable: string;
  let syllableList: string[];
  let result: string[] = [];
  let accentSyllableList: string[] = [];
  let sentenceList = text.split("\n");
  let isRhyme = false;
  let errorWordList: string[] = [];

  sentenceList.forEach((sentence) => {
    let coloredSentence = "";
    let wordList: string[] = sentence.split(" ");
    accentSyllableList = [];

    wordList.forEach((word) => {
      syllableList = pronounceData[formatWord(word).toUpperCase()];

      if (typeof syllableList !== "undefined") {
        syllableList.forEach((syllable) => {
          if (syllable.slice(-1) === "1") {
            accentSyllableList.push(syllable);
          }
        });
      } else {
        errorWordList.push(word);
      }
    });

    //Filter for non-duplicate elements
    accentSyllableList = accentSyllableList.filter(function (x, i, self) {
      return self.indexOf(x) === i && i !== self.lastIndexOf(x);
    });

    wordList.forEach((word) => {
      isRhyme = false;
      syllableList = pronounceData[formatWord(word).toUpperCase()];

      if (typeof syllableList !== "undefined") {
        syllableList.forEach((syllable) => {
          if (accentSyllableList.indexOf(syllable) !== -1) {
            word = applyColor(word, count, syllable, accentSyllableList);
          }
        });
      }
      coloredSentence += word + " ";
    });
    result.push(coloredSentence);
    count += accentSyllableList.length;
  });
  return [result, errorWordList];
};

const checkMultipleLineRhyme = (): void => {
  let text: string = (<HTMLInputElement>document.getElementById("verse")).value;
  //Remove multiple spaces in a row
  text = text.replace(/^\s+|\s+$/g, "").replace(/ +/g, " ");

  let accentSyllable: string;
  let syllableList: string[][] = [];
  let result: string[] = [];
  let accentSyllableList: string[] = [];
  let sentenceList = text.split("\n");
  let sentenceSyllableList;
  let isRhyme = false;
  let errorWordList: string[] = [];

  sentenceList.forEach((sentence) => {
    syllableList = [];
    let coloredSentence = "";
    let wordList: string[] = sentence.split(" ");
    accentSyllableList = [];

    wordList.forEach((word) => {
      syllableList.push(pronounceData[formatWord(word).toUpperCase()]);
    });
    sentenceSyllableList = syllableList.flat();
    console.log(sentenceSyllableList);
  });
};

const checkRhyme = (): void => {
  const resultHTMLElement = <HTMLInputElement>document.getElementById("result");
  const result: string[][] = checkSingleLineRhyme();
  const coloredSentence: string = result[0].join("<br><br>");
  const errorWordList: string[] = result[1];
  const notFoundHTMLElement = <HTMLInputElement>(
    document.getElementById("notFoundWord")
  );
  notFoundHTMLElement.innerHTML = "";

  resultHTMLElement.innerHTML = coloredSentence;

  if (errorWordList.length !== 0 && errorWordList[0] !== "") {
    notFoundHTMLElement.innerHTML = createNotFoundWordList(errorWordList);
  }
  checkMultipleLineRhyme();
};
