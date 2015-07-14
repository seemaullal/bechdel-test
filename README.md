##Bechderator
##### Visualize movie scripts and predict if movies pass the Bechdel test
=============
![Badge of Honor](https://img.shields.io/badge/Built%20at-Fullstack-green.svg?style=flat-square)

## Table of Contents
- [Screenshot](#screenshot)
- [Instructions](#instructions)
- [Features](#features)
- [Next Steps](#talks)
- [Talks](#talks)
- [Contributors](#contributors)
- [License](#license)


## Screenshot
![Picture](http://i.imgur.com/y4Lyl8b.jpg?1)
_Above: The Bechderator analyzes the 1995 cult classic Clueless_

See a live version of the app [here](http://www.bechdelerator.com/).


## Instructions
To see if your favorite movie passes the Bechdel Test:
 1.  Select the movie from the drop down list
 2. Click Bechdelerate to see the Bechdelerator's Analysis.
 3. The D3 focal graph created reflects communication between characters. Pink nodes are female, blue nodes are male, the lines connecting them are lines shared between them. To identify a particular character, hover over a node.

## Features
- Scrapes movie script data from <a href="http://www.imsdb.com/">IMSDB</a> using the Cheerio and Request libraries
- Identifies main characters through our Bechdelerator Algorithm and through the Rotten Tomatoes API
- Makes predictions about the genders of main characters with the Genderize API
- Predicts if a given movie passes the Bechdel Test
- Generates a D3 focal graph reflecting character communication


## Next Steps
- Improve user interface
- Store results in a database rather than regenerate results each time
- Add ability to analyze results

## Talks
- "Building the Bechdelerator" ( <a href="http://slides.com/seemaullal/bechdelerator-7">Slides</a> )
  &nbsp;*QueensJS,* July 2015 
- "The Bechdelerator" (<a href="http://slides.com/seemaullal/bechdelerator">Slides</a>)
&nbsp;*Women Who Code*, June 2015 


## Contributors
* __Seema Ullal__ - [LinkedIn](https://www.linkedin.com/profile/in/seemaullal) | [GitHub](https://github.com/seemaulla)
* __Sarah Muenzinger__ - [LinkedIn](https://www.linkedin.com/profile/in/sarahmuenzinger) | [GitHub](https://github.com/smuenzinger)

## License

This project is licensed under the terms of the [MIT license](http://opensource.org/licenses/MIT)
