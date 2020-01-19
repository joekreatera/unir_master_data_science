/*
TODO!!

- output the nulls found
- double quote in headers to include "," on header title.
*/
class DataLine{

  /*
  * Return a correct array checking requirements:
    if there are quotation marks, comma based division should not be made
    if there is a possibility to convert to number, do it!
    (parser)
  */

  static parseAndSeparateString(csvString , elementsDesired){

    var i  = 0;
    var c  = '';
    var qMark = false;
    var actualWord = "";
    var elements = Array();
    var isNumber = true; // consider they are numbers by default
    var pointsNumber = 0;

    for( i = 0; i < csvString.length ; i++){
      c = csvString.charAt(i);
      if(!qMark && c == ','){
        if( !isNumber){
          elements.push('"'+actualWord+'"');
          actualWord = "";
          isNumber = true;
          pointsNumber = 0;
        }else{
          elements.push(Number( actualWord.trim() ));
          actualWord = "";
          isNumber = true;
          pointsNumber = 0;
        }
      }else{
        if(c == '"' && !qMark){
          qMark = true;
        }else if( c=='"' && qMark){
          qMark = false;
        }else if( c=='.'){
          pointsNumber++;
          actualWord += c;
          if( pointsNumber > 1){
            isNumber = false;
          }
        }else if(c*0 == 0){
          // is digit
            actualWord += c;
        }else{
            // is character!!! add to actual string
            isNumber = false;
            actualWord += c;
        }
      }
    }


    if( qMark ){
      console.log("BIG ERROR!!! -> quotation mark not closed");
    }else{

      if( !isNumber){
        elements.push('"'+actualWord+'"');
      }else{
        elements.push(Number( actualWord.trim() ));
      }


    }
    if( elements.length != elementsDesired){
      console.log(csvString);
      console.log("MISSING DATA ON ROW!!! " + elements.length + " != " + elementsDesired);
      for( i = elements.length ; i < elementsDesired ; i++){
        elements.push("null");
      }
    }
    console.log(elements);
    return elements;
  }


  /* return array of elements*/
  static buildCorrectString(str, charToAvoid){
    var  i = 0;
    var actualElem = 0;
    var data = Array();
    data.push("");
    var isSpace = false;
    var wasSpace  = false;
    for( i = 0; i < str.length ; i++ ){
      isSpace = false;
      if(str.charAt(i) == ' '){
        isSpace = true;
      }

      if( wasSpace && !isSpace){
        actualElem++;
        data.push("");
      }

      if(!isSpace){
        if( str.charAt(i) != charToAvoid )
          data[actualElem] += str.charAt(i);
      }
      wasSpace = isSpace;
    }
    return data;
  }



  constructor(headerLine, str){
    this.headerLine = headerLine; // array with header data
    console.log(this.headerLine);
    this._data = DataLine.parseAndSeparateString(str , headerLine.length );
  }

  printJson(divider){

    var i,j = 0;
    var res = "";

    for(i = 0 ; i < this.headerLine.length ; i++){
        res += '"' + this.headerLine[i] + '":' + this._data[i]+","
    }

    res += '"done":1';
    return "{"+res+"}";
  }
}


var fs = require('fs');

function checkOutput(programArguments , filetype){
  var i = 0;
  for( i = 1; i < programArguments.length ; i++ ){
    var keyValue = programArguments[i].split('=');
    if( keyValue.length > 1){
      if(keyValue[0] == filetype){
        return keyValue[1];
      }
    }
  }
    return false;
}

var welcomeMessage = "Welcome to this data parser algorithm. This includes getting the data into mongodb. Remember to use npm install to set up. To use: node index.js and Add input='csvfilename.json' and output json='jsonfilename.json'";

console.log(welcomeMessage);

var parts = (""+(""+process.argv).split(' ')[1]).split(',');
var outputJson = checkOutput(parts,'json');
var inputFile =  checkOutput(parts,'input');
console.log("Reading " + inputFile);
console.log("Outout json to " + outputJson);

var fileContents = ""+fs.readFileSync(inputFile);
var fileLines = fileContents.split('\n');
var i = 0;
var data = Array();
var csvOut = "";
var jsonOut = "";

fileLines[0] = fileLines[0].replace(/\r/g,"");
var headerLines = fileLines[0].split(',');

for( i = 1; i < fileLines.length ; i++){
  if( fileLines[i] != ""){
    fileLines[i] = fileLines[i].replace(/\r/g,"")
    data.push( new DataLine(headerLines, fileLines[i]) );
    jsonOut += (data[i-1].printJson(",") ) + ( (i<fileLines.length-1)?",":"" );
  }
}

console.log(jsonOut);

if( outputJson != false)
  fs.writeFileSync(outputJson, "["+jsonOut+"]");
