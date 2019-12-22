/*
Se solicita reparar los datos de un dataset, disponible en el aula virtual.
No importa el lenguaje utilizado para repararlo. Dentro de los requisitos de saneamiento se pide:

»	Generar un csv separado por comas
»	Que el carácter decimal sea el ‘.’ (punto)
»	Eliminar los caracteres extraños de longitud y latitud
»	Ponerle el símbolo de temperatura a todas las medidas
»	Comprobar que la media es la media aritmética de las temperaturas de los meses del año. En el caso que no sea correcta indicarlo en una columna
adicional con un número que indique la desviación.

*/
class DataLine{

/*
Longitud	Latitud	Enero	Febrero	Marzo	Abril	Mayo	Junio	Julio	Agosto	Septimbre	Octubre	 Noviembre	 Diciembre Media
*/
  static replaceStrange(str, charToSet){
    return str.replace(/º/g,charToSet);
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

  constructor(str){
    //this._data = str.split("  ");
    this._avg = 0;
    //this._data = DataLine.buildCorrectString( str ,'º');
    this._data = DataLine.replaceStrange( str , "").split("@");
    for(var d in this._data){
      this._data[d] = parseFloat(this._data[d]);
      if( d > 1){
        this._avg += this._data[d];
      }
    }
    this._avg /= 12
    /* phase 3 */
    this._error = (this._avg - this._data[14]) > 0.01;
  }

  printNice(divider){

    var str = "Longitud "+this._data[0]+""+divider
    +"Latitud "+this._data[1]+""+divider
    +"Enero "+this._data[2]+""+divider
    +"Febrero "+this._data[3]+""+divider
    +"Marzo "+this._data[4]+""+divider
    +"Abril "+this._data[5]+""+divider
    +"Mayo "+this._data[6]+""+divider
    +"Junio "+this._data[7]+""+divider
    +"Julio "+this._data[8]+""+divider
    +"Agosto "+this._data[9]+""+divider
    +"Septimbre "+this._data[10]+""+divider
    +"Octubre "+this._data[11]+""+divider
    +"Noviembre "+this._data[12]+""+divider
    +"Diciembre "+this._data[13]+""+divider
    +"Media "+this._data[14]+""+divider
    +"AVG "+this._avg+""+divider
    +"Error "+this._error+"";

    return str;
  }

  printCsv(divider){

    var str = this._data[0]+""+divider
    +this._data[1]+""+divider
    +this._data[2]+"º"+divider
    +this._data[3]+"º"+divider
    +this._data[4]+"º"+divider
    +this._data[5]+"º"+divider
    +this._data[6]+"º"+divider
    +this._data[7]+"º"+divider
    +this._data[8]+"º"+divider
    +this._data[9]+"º"+divider
    +this._data[10]+"º"+divider
    +this._data[11]+"º"+divider
    +this._data[12]+"º"+divider
    +this._data[13]+"º"+divider
    +this._data[14]+""+divider
    +this._avg+""+divider
    +this._error+"";

    return str;
  }

  printJson(divider){

    var str = '{"Longitud":'+this._data[0]+""+divider
    +'"Latitud":'+this._data[1]+""+divider
    +'"Enero":'+this._data[2]+""+divider
    +'"Febrero":'+this._data[3]+""+divider
    +'"Marzo":'+this._data[4]+""+divider
    +'"Abril":'+this._data[5]+""+divider
    +'"Mayo":'+this._data[6]+""+divider
    +'"Junio":'+this._data[7]+""+divider
    +'"Julio":'+this._data[8]+""+divider
    +'"Agosto":'+this._data[9]+""+divider
    +'"Septimbre":'+this._data[10]+""+divider
    +'"Octubre":'+this._data[11]+""+divider
    +'"Noviembre":'+this._data[12]+""+divider
    +'"Diciembre":'+this._data[13]+""+divider
    +'"Media":'+this._data[14]+""+divider
    +'"AVG":'+this._avg+""+divider
    +'"Error":'+this._error+"}";

    return str;
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

var welcomeMessage = "Welcome to this data parser algorithm. This includes getting the data into mongodb. Remember to use npm install to set up. To use: node index.js and Add csv='csvfilename.json' to output csv file and json='jsonfilename.json' to output json file. Totally optional.";

console.log(welcomeMessage);

var parts = (""+(""+process.argv).split(' ')[1]).split(',');
var outputCsv = checkOutput(parts,'csv');
var outputJson = checkOutput(parts,'json');
var inputFile =  checkOutput(parts,'input');
console.log("Reading " + inputFile);
console.log("Output csv to " + outputCsv);
console.log("Outout json to " + outputJson);

var fileContents = ""+fs.readFileSync(inputFile);

/*phase 1: replace , per .*/
var fileContents = fileContents.replace(/\,/g,".");
fileContents = fileContents.replace(/\ \ /g,"@");
fileContents = fileContents.replace(/@@/g,"@");

var fileLines = fileContents.split('\n');
var i = 0;
var data = Array();
var csvOut = "";
var jsonOut = "";
for( i = 1; i < fileLines.length ; i++){
  /* phase 2: replace rare characters*/
  //fileContents = fileContents.replace(/º/g,"")
  data.push( new DataLine(fileLines[i]) );
  csvOut += (data[i-1].printCsv(",") ) + "\n";

  jsonOut += (data[i-1].printJson(",") ) + ( (i<fileLines.length-1)?",":"" );
}

if( outputCsv != false)
  fs.writeFileSync(outputCsv, csvOut);

if( outputJson != false)
  fs.writeFileSync(outputJson, "["+jsonOut+"]");
