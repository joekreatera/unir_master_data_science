# UNIR Data

The following exercise works for Activity 1.

It does:
[] Replaces all ',' with '.' (line 166)
[] Replaces all double spaces with @
[] Replaces double @ with just one (This is because there are some 4 space segments in the file)
[] Split all the lines by the \n character
[] For each line, divide the data by @ sign (line 53)
[] For each line, convert all data to float (decimal) (line 55)
[] For each line, if data is any month, add it up to variable (line 57)
[] Average the sum (line 60)
[] Calculate Mean difference and set Flag on true if error is above 0.01
[] For each line, save a representation as csv (line 179)
[] For each line, save a representation as json (line 181)
[] Write files if they are needed



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
