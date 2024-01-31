# In-Character

## Table of Contents

 * [Explanation](#explanation)
 * [Live Version](#live-version)
 * [Compatibility](#compatibility)
 * [Testing](#testing)
 * [File Descriptions](#file-descriptions)
 * [Technologies](#technologies)
 * [Validation](#validation)

## Explanation

A short puzzle-platform game, where you turn into different letters to navigate the levels.

## Live Version

https://robson.plus/in-character/

## Compatibility

The output for this project is designed for desktop only. Mobile is not supported.

| Platform | OS      | Browser          | Version | Status  |
| :------- | :------ | :--------------- | :------ | :------ |
| Desktop  | Windows | Firefox          |  99     | Working |
| Desktop  | Windows | Opera            |  85     | Working |
| Desktop  | Windows | Chrome           | 100     | Working |
| Desktop  | Windows | Edge             | 100     | Working |

Last tested on 13th April 2021.

## Testing

To run this on your computer:
 * [Download the repository](https://github.com/Robson/In-Character/archive/master.zip).
 * Unzip anywhere.
 * Open *index.html* in your browser.
 
## File Descriptions

### index.html

This is the webpage that everything else is loaded into. This has been kept as simple as possible, so it mostly links to the stylesheet and JavaScript files.

### keys.js

This is a list of keyboard keys and their associated numbers in JavaScript.

### letters.js

This contains the shape of every letter of the alphabet. It also contains some special characters, but these aren't used.

### levels.js

This contains the levels in the order they are played. Each level has data such as the name, layout, starting letter, starting position, etc. New levels can be added by just editing this file.

### page.js

This is the JavaScript that makes everything work.

### stars1.png & stars2.png

This is the background of the page.

### style.css

This is where all the formatting is stored.

## Technologies

This is built using:
 * HTML
 * CSS
 * JavaScript
   * <a href="https://github.com/jquery/jquery">jQuery</a>

## Validation
   
<a href="https://validator.w3.org/nu/?doc=https%3A%2F%2Frobson.plus%2Fin-character%2F"><img src="https://www.w3.org/Icons/valid-html401-blue" alt="Valid HTML" /></a>

<a href="https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Frobson.plus%2Fin-character%2Fstyle.css&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en"><img src="https://jigsaw.w3.org/css-validator/images/vcss-blue" alt="Valid CSS" /></a>   

[![X](https://www.codefactor.io/repository/github/robson/In-Character/badge?style=flat-square)](https://www.codefactor.io/repository/github/robson/In-Character)