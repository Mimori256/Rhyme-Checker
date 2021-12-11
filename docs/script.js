"use strict";
/*const colorCodeList: string[] = [
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
];*/
const colorCodeList = [
    "#6658A6",
    "#96c958",
    "#1ba9d7",
    "#f6f880",
    "#e8d4c6",
    "#006400",
    "#da1552",
    "#d98240",
    "#c71585",
    "#3cb371",
    "#d51552",
];
const capitalize = (sentence) => {
    return sentence.toUpperCase();
};
const formatWord = (word) => {
    word = word.replace(",", "");
    word = word.replace(".", "");
    word = word.replace("!", "");
    word = word.replace("?", "");
    word = word.replace("(", "");
    word = word.replace(")", "");
    word = word.replace('"', "");
    word = word.replace(":", "");
    word = word.replace(";", "");
    word = word.replace("”", "");
    word = word.replace("“", "");
    word = word.replace("’", "'");
    return word;
};
const applyColor = (word, count, accentSyllable, accentSyllableList) => {
    word =
        colorCodeList[(accentSyllableList.indexOf(accentSyllable) + count) %
            colorCodeList.length] +
            word +
            "</span>";
    return word;
};
const colorWord = (word, color) => {
    return '<span style = "background-color:' + color + '">' + word + "</span>";
};
const createNotFoundWordList = (wordList) => {
    let header;
    if (wordList.length === 1) {
        header = "<h3>Word that couldn't be found in the dictionary</h3>";
    }
    else {
        header = "<h3>Words that couldn't be found in the dictionary</h3>";
    }
    return header + wordList.join(", ");
};
const countElementFromList = (list, element) => {
    let count = 0;
    for (let i = 0; i < list.length; i++) {
        if (list[i] === element)
            count++;
    }
    return count;
};
const checkSingleLineRhyme = () => {
    let count = 0;
    let text = document.getElementById("verse").value;
    //Remove multiple spaces in a row
    text = text.replace(/^\s+|\s+$/g, "").replace(/ +/g, " ");
    let accentSyllable;
    let syllableList;
    let result = [];
    let accentSyllableList = [];
    let sentenceList = text.split("\n");
    let isRhyme = false;
    let errorWordList = [];
    sentenceList.forEach((sentence) => {
        let coloredSentence = "";
        let wordList = sentence.split(" ");
        accentSyllableList = [];
        wordList.forEach((word) => {
            syllableList = pronounceData[formatWord(word).toUpperCase()];
            if (typeof syllableList !== "undefined") {
                syllableList.forEach((syllable) => {
                    if (syllable.slice(-1) === "1") {
                        accentSyllableList.push(syllable);
                    }
                });
            }
            else {
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
const checkMultipleLineRhyme = () => {
    let text = document.getElementById("verse").value;
    //Remove multiple spaces in a row
    text = text.replace(/^\s+|\s+$/g, "").replace(/ +/g, " ");
    let accentSyllable;
    let syllableList = [];
    let result = [];
    let accentSyllableList = [];
    let accentSyllableDict = {};
    let tmpVerseList;
    let verseList = [];
    let errorWordList = [];
    //syllableColorDict["accentSyllable"] = "color"
    let syllableColorDict = {};
    let count = 0;
    let sentenceList = text.split("\n");
    tmpVerseList = text.split("\n\n");
    for (let i = 0; i < tmpVerseList.length; i++) {
        verseList.push(tmpVerseList[i].split("\n"));
    }
    verseList.forEach((verse) => {
        syllableColorDict = {};
        accentSyllableList = [];
        accentSyllableDict = {};
        verse.forEach((sentence) => {
            let wordList = sentence.split(" ");
            wordList.forEach((word) => {
                syllableList = pronounceData[formatWord(word).toUpperCase()];
                if (typeof syllableList !== "undefined") {
                    syllableList.forEach((syllable) => {
                        if (syllable.slice(-1) === "1") {
                            if (typeof accentSyllableDict[syllable] === "undefined") {
                                accentSyllableDict[syllable] = 1;
                            }
                            else {
                                accentSyllableDict[syllable] += 1;
                            }
                        }
                    });
                }
            });
        });
        count = 0;
        verse.forEach((sentence) => {
            let coloredSentence = "";
            let wordList = sentence.split(" ");
            wordList.forEach((word) => {
                syllableList = pronounceData[formatWord(word).toUpperCase()];
                if (typeof syllableList !== "undefined") {
                    syllableList.forEach((syllable) => {
                        if (syllable.slice(-1) === "1" &&
                            Object.keys(syllableColorDict).indexOf(syllable) === -1) {
                            syllableColorDict[syllable] =
                                colorCodeList[count % colorCodeList.length];
                            count++;
                        }
                    });
                }
                else {
                    errorWordList.push(word);
                }
            });
            wordList.forEach((word) => {
                syllableList = pronounceData[formatWord(word).toUpperCase()];
                if (typeof syllableList !== "undefined") {
                    syllableList.forEach((syllable) => {
                        if (Object.keys(syllableColorDict).indexOf(syllable) !== -1 &&
                            accentSyllableDict[syllable] > 1) {
                            word = colorWord(word, syllableColorDict[syllable]);
                        }
                    });
                }
                coloredSentence += word + " ";
            });
            result.push(coloredSentence);
            count += accentSyllableList.length;
        });
        result.push("\n\n");
    });
    return [result, errorWordList];
};
const checkRhyme = () => {
    const resultHTMLElement = document.getElementById("result");
    const result = checkMultipleLineRhyme();
    const coloredSentence = result[0].join("<br><br>");
    const errorWordList = result[1];
    const notFoundHTMLElement = (document.getElementById("notFoundWord"));
    notFoundHTMLElement.innerHTML = "";
    resultHTMLElement.innerHTML = coloredSentence;
    if (errorWordList.length !== 0 && errorWordList[0] !== "") {
        notFoundHTMLElement.innerHTML = createNotFoundWordList(errorWordList);
    }
};
