# Bechderator
=============
![Badge of Honor](https://img.shields.io/badge/Built%20at-Fullstack-green.svg?style=flat-square)
> Visualize movie scripts and the Bechdel test

## Table of Contents

- [Screenshot](#screenshot)
- [Instructions](#instructions)
- [Roadmap](#roadmap)
- [Contributors](#contributors)
- [License](#license)


### Screenshot

![Picture](http://i.imgur.com/9J43xR5.png)
_Above: The Bechderator analyzes the 1995 cult classic Clueless_

See a live version of the app [here](http://bechdelerator.herokuapp.com/).


## Instructions

To see if your favorite movie passes the Bechdel Test:
 1. Copy your favorite movie script
 2. Paste it into the Bechdelerator
 3. Type in the title of the movie
 4. Click Tomato Analysis or Split Analysis to see the Bechdelerator's Analysis.
Tomato Analysis uses Rotten Tomatoes' API to identify major characters, while Split Analysis attempts to identify them through the Bechderator algorithm.
 5. The D3 focal graph created reflects communication between characters. Pink nodes are female, blue nodes are male, the lines connecting them are lines shared between them. To identify a particular character, hover over a node.


### Roadmap

#### Features

-	Identifies main characters through our Bechdelerator Algorithm and through the Rotten Tomatoes API
-	Makes predictions about the genders of main characters with the Genderize API
-	Predicts if a given movie passes the Bechdel Test
-	Generates a D3 focal graph reflecting character communication

#### Next Steps

- Form validation
- Web scraping to find movie scripts directly
- Improve user interface
- Store results in a database rather than regenerate results each time

## Contributors
* __Seema Ullal__ - [LinkedIn](https://www.linkedin.com/profile/in/seemaullal) | [GitHub](https://github.com/seemaulla)
* __Sarah Muenzinger__ - [LinkedIn](https://www.linkedin.com/profile/in/sarahmuenzinger) | [GitHub](https://github.com/smuenzinger)

## License

This project is licensed under the terms of the [MIT license](http://opensource.org/licenses/MIT)



