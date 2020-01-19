# UNIR Data

*WARNING*

The following exercise works for Activity 1 and Activity 2. It exports the recordsets to both file types

It does:
- [x] Replaces all ',' with '.' (line 166)
- [x] Replaces all double spaces with @
- [x] Replaces double @ with just one (This is because there are some 4 space segments in the file)
- [x] Split all the lines by the \n character
- [x] For each line, divide the data by @ sign (line 53)
- [x] For each line, convert all data to float (decimal) (line 55)
- [x] For each line, if data is any month, add it up to variable (line 57)
- [x] Average the sum (line 60)
- [x] Calculate Mean difference and set Flag on true if error is above 0.01
- [x] For each line, save a representation as csv (line 179)
- [x] For each line, save a representation as json (line 181)
- [x] Write files if they are needed



# Requirements
1. Nodejs installed
2. Download this folder
3. Execute npm install (NPM is a utility that node.js installs)
4. Execute npm start
5. If there are no errors, there should be two files:
  a) jsonfile.json
  b) csvfile.csv

## Additional stuff

Function buildCorrectString avoid the use of RegExp. Changes the line passed to it and divides the string manually.
