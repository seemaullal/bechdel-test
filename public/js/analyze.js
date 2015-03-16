var commonWords = [
  "the",
  "be",
  "to",
  "of",
  "and",
  "a",
  "in",
  "int",
  "that",
  "have",
  "I",
  "it",
  "for",
  "not",
  "on",
  "with",
  "he",
  "as",
  "you",
  "do",
  "at",
  "this",
  "but",
  "his",
  "by",
  "from",
  "they",
  "we",
  "say",
  "her",
  "she",
  "or",
  "an",
  "will",
  "my",
  "one",
  "all",
  "would",
  "there",
  "their",
  "what",
  "so",
  "up",
  "out",
  "if",
  "about",
  "who",
  "get",
  "which",
  "go",
  "me",
  "when",
  "make",
  "can",
  "like",
  "time",
  "no",
  "just",
  "him",
  "know",
  "take",
  "people",
  "into",
  "year",
  "your",
  "good",
  "some",
  "could",
  "them",
  "see",
  "other",
  "than",
  "then",
  "now",
  "look",
  "only",
  "come",
  "its",
  "over",
  "think",
  "also",
  "back",
  "after",
  "use",
  "two",
  "how",
  "our",
  "work",
  "first",
  "well",
  "way",
  "even",
  "new",
  "want",
  "because",
  "any",
  "these",
  "give",
  "day",
  "most",
  "us",
  "here",
  "such",
  "much",
  "yet",
  "very",
  "every",
  "many", 
  "cut",
  "scene",
  "hall",
  "hallway",
  "miss",
  "mr", 
  "close", 
  "angle"
];
var womenNames = [];
var tests = 0;
var linkFinder = function(script, topNames){
  //
  var ladyConvoCount = 0;
  var linesAboutMen = 0;
	var nameCatcher = /\s[A-Z]+\s/g;
	var names = script.match(nameCatcher);
	names = names.filter(function(word){
		word = word.replace(/(\r\n|\n|\r)/gm,"").trim();
		return word.length > 1;
	});
	
	var lines = script.split(nameCatcher);
	var conversations = [];
	for(var nameIndex = 0; nameIndex < (names.length); nameIndex++){
		var convo = {};
		convo.personA = names[nameIndex];
		convo.personB = names[nameIndex+1];
    console.log("convo",convo);
    convo.line = lines[nameIndex];
    if (convo.personA && convo.personB) {
      if(womenNames.indexOf(convo.personA.trim()) > -1 && womenNames.indexOf(convo.personB.trim()) > -1){
        ladyConvoCount++;

        if(convo.line.match(/he|him|his/)){
          linesAboutMen++;
        }
      }
  		conversations.push(convo);
    }
	}
  $("#ladyConvoCount").text("We *think* there were "+ladyConvoCount+" converstations between women");
	$("#linesAboutMen").text("We predict that "+linesAboutMen+ " of those conversations were about men");
  if(ladyConvoCount > 0){
    tests++;
  }
  if(ladyConvoCount > linesAboutMen){
    tests++;
  }
  console.log("names",names);
	console.log("lines",lines);
	console.log("conversations",conversations);
	links = [];
  
  console.log("topNames", topNames);
	conversations.forEach(function(convo){

		var source = topNames.indexOf(convo.personA);
		var target = topNames.indexOf(convo.personB);
		if (source > -1 && target > -1){
			link = {"source": source, "target":target, "value":2};
			links.push(link);
		}
	});
	return links;
};

var analyzer = function(script){
  script = script.replace(/(\r\n|\n|\r)/gm," ");
  //finds namey strings in script
	var nameCatcher = /\s[A-Z]+\s/g;
	var names = script.match(nameCatcher);
  //filter out returns and spaces and such from the names
	names = names.filter(function(word){
		word = word.replace(/(\r\n|\n|\r)/gm,"").trim();
		return word.length > 1 && (commonWords.indexOf(word.toLowerCase())== -1);
	});

	// names = _.uniq(names);

  //count all the names
	var counts = _.countBy(names);
	
  //sort the names by most frequent
	var sorted = _.chain(counts).
		map(function(cnt,name){
			return{
				name:name,
				count:cnt
				};
			})
		.sortBy('count').value();
	
  //return the topNames 
	var topNames = sorted.reverse().slice(0,10);
	

	var nodes = [];
  var genderCount = 0;
  
  //go through each of the top names
	async.each(topNames, function(nameObj, done){

    //further trim whitespace from names
    var name = nameObj.name.trim();

    //determine the gender of the name
    $.get('/api/gender/'+name, function(data){

      //if the person's name is female-ish we give it a value of zero otherwise we declare it a 1
      if(data.gender == "female"){
        groupNum = 0;
        genderCount++;
        womenNames.push(name);
      }else{
        groupNum = 1;
      }
      //we push a new node with name and gender value to our array
      nodes.push({"name":nameObj.name, "group":groupNum});

      //we make topNames an array of strings rather than objects
      // topNames[topNames.indexOf(nameObj)] = name;

      done();
    });
	}, function(){
    topNames = topNames.map(function(nameObj){
      return nameObj.name;
    });
    var links = linkFinder(script, topNames);
    console.log('nodes',nodes);
    console.log('links',links);
    noder(nodes, links);
    $("#womanCount").text("There are "+genderCount+" major characters with womanly names:");
    $("#womanNames").text("We found these top lady characters: "+womenNames);
    if(womenNames.length >=2){
      tests++;
    }
    if(tests == 3){
      $("#finalResult").text("We feel pretty confident that this movie passes");
    }else if(tests == 2){
     $("#finalResult").text("This movie probably does not pass the Bechdel Test");
   }else{
     $("#finalResult").text("If we had to guess, we'd say this movie does not pass the Bechdel Test");
    }

  });
	
};
function noder(nodes, links, tomato){
	console.log("nodes",nodes);
	var width = 1000,
	height = 1000;
	// var color = d3.scale.category20();
  var color = d3.scale.linear()
    .domain([0, 1])
    .range(["pink", "blue"]);
	var force = d3.layout.force()
	.charge(-120)
	.linkDistance(200)
	.size([width, height]);
	var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);
	d3.json("mis.json", function(error, graph) {
	force
	.nodes(nodes)
	.links(links)
	.start();
	
	var link = svg.selectAll(".link")
	.data(links)
	.enter().append("line")
	.attr("class", "link")
	.style("stroke-width", function(d) { return Math.sqrt(d.value); });
	var node = svg.selectAll(".node")
	.data(nodes)
	.enter().append("circle")
	.attr("class", "node")
	.attr("r", function (datum, index) {
      if (tomato) {
        return links.filter(function (link) { 
          return link.source.index == index;
        })
        .length/5;
      }
      else {
        return links.filter(function (link) { 
          return link.source.index == index;
        })
        .length/25; 
      }
  })
	.style("fill", function(d) { return color(d.group); })
	.call(force.drag);
	node.append("title")
	.text(function(d) { return d.name; });
	force.on("tick", function() {
	link.attr("x1", function(d) { return d.source.x; })
	.attr("y1", function(d) { return d.source.y; })
	.attr("x2", function(d) { return d.target.x; })
	.attr("y2", function(d) { return d.target.y; });
	node.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; });
	});
	});

}
function tomatoesAreFruit(movieName) {
  var chars = [];
  var genderCount = 0;
  $.get('/api/getcast/' + movieName, function (data) {
    chars = data;
    chars.forEach( function(character,index,arr) {
      arr[index] = character.toUpperCase().trim();
    });



    var re = new RegExp(chars.join("|"), "g");
    var script2 = $("#script").val();
    script = script2.replace(/(\r\n|\n|\r)/gm,"").replace(/\s+/g," ");
    script.replace('↵','');
    var names = script.match(re);
    var lines = script.split(re);
    var conversations = [];
    for(var nameIndex = 0; nameIndex < (names.length-1); nameIndex++){
      var convo = {};
      convo.personA = names[nameIndex];
      convo.personB = names[nameIndex+1];
      // if (convo.personA !== convo.personB) {
      convo.line = lines[nameIndex];
      if (convo.line && convo.line.toUpperCase() !== convo.line) {
        convo.line = convo.line.replace(/\b([A-Z]{2,})\b/g,"");
        conversations.push(convo);
      }
    }
    var nodes = [];
    var genders = [];
    var names = [ ];
    async.each(chars, function(name, done) {
      $.get('/api/gender/'+name, function(data){
        if(data.gender == "female"){
          groupNum = 0;
          genderCount++;
          womenNames.push(name);
        } else{
          groupNum = 1;
        }
        nodes.push({"name":name, "group":groupNum});
        names.push(name);
        done();
       });
    }, 
    function() {
      var links = [ ];
      conversations.forEach(function(convo){
          var source = names.indexOf(convo.personA);
          var target = names.indexOf(convo.personB);
          if (source > -1 && target > -1){
            if(womenNames.indexOf(convo.personA.trim()) > -1 && womenNames.indexOf(convo.personB.trim()) > -1){
              ladyConvoCount++;

              if(convo.line.match(/he|him|his/)){
                linesAboutMen++;
              }
            }
            link = {"source": source, "target":target, "value":2};
            links.push(link);
          }
        });
      $("#womanCount").text("There are "+genderCount+" major characters with womanly names:");
    $("#womanNames").text("We found these top lady characters: "+womenNames);
      $("#ladyConvoCount").text("We *think* there were "+ladyConvoCount+" converstations between women");
      $("#linesAboutMen").text("We predict that "+linesAboutMen+ " of those conversations were about men");
      if(ladyConvoCount > 0){
        tests++;
      }
      if(ladyConvoCount > linesAboutMen){
        tests++;
      }
       if(tests == 3){
         $("#finalResult").text("We feel pretty confident that this movie passes");
       }else if(tests == 2){
        $("#finalResult").text("This movie probably does not pass the Bechdel Test");
      }else{
        $("#finalResult").text("If we had to guess, we'd say this movie does not pass the Bechdel Test");
       }
      noder(nodes, links, true);
    });
    
      // }
      // else {
      //   convo.line = lines[nameIndex];
      //   while (convo.personA == convo.personB) {
      //     nameIndex++;
      //     convo.line += lines[nameIndex];
      //     convo.personB = names[nameIndex];
      //   }
      //   if (convo.line && convo.line.toUpperCase() !== convo.line) {
      //     convo.line = convo.line.replace(/\b([A-Z]{2,})\b/g,"");
      //     conversations.push(convo);
      //   }
      // }
  
});
}

$(document).ready(function(){
    $("#splitAnalysis").click(function(){
    	analyzer($("#script").val());
      $("#movieNameDisplay").text($("#movieName").val())
      $("#results").show();
    });
    $("#tomatoesAnalysis").click(function(){
        tomatoesAreFruit($("#movieName").val());
        $("#movieNameDisplay").text($("#movieName").val())
        $("#results").show();
    });
});
