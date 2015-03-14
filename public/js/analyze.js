var commonWords = [
  "the",
  "be",
  "to",
  "of",
  "and",
  "a",
  "in",
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
  "many"
];
var linkFinder = function(script, topNames){
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
		convo.line = lines[nameIndex];
		conversations.push(convo);
	}
	console.log("names",names);
	console.log("lines",lines);
	console.log("conversations",conversations);
	links = [];
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
	var nameCatcher = /\s[A-Z]+\s/g;
	var names = script.match(nameCatcher);
	var nameAndGenders = {};
	names = names.filter(function(word){
		word = word.replace(/(\r\n|\n|\r)/gm,"").trim();
		return word.length > 1 && (commonWords.indexOf(word.toLowerCase())== -1);
	});

	// names = _.uniq(names);

	var counts = _.countBy(names);
	console.log("counts", counts);
	var sorted = _.chain(counts).
		map(function(cnt,name){
			return{
				name:name,
				count:cnt
				};
			})
		.sortBy('count').value();
	console.log(sorted);
	var topNames = sorted.reverse().slice(0,50);
	console.log(topNames);
	var nodes = [];
  var genders = [];
	topNames.forEach(function(nameObj, index, arr){
  //   setTimeout(function(){ 
  //     var name = nameObj.name.trim()
  //     $.get("https://gender-api.com/get?name="+name+"&key=PUTKEYHERE",function(data){
  //       genders.push(data.gender)
  //   }); 
  // }, 1000);
    
    var groupNum = Math.floor(Math.random()*2);
		nodes.push({"name":nameObj.name, "group":groupNum});
		arr[index] = nameObj.name;

	});
  
	var links = linkFinder(script, topNames);
  console.log('nodes',nodes);
  console.log('links',links);
	noder(nodes, links);
	
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
        .length;
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
  $.get('/api/getcast/' + movieName, function (data) {
    var chars = data;
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
    console.log(conversations);
      var nodes = [];
      var genders = [];
      names = _.uniq(names);
      names.forEach(function(name, index, arr){
      //   setTimeout(function(){ 
      //     var name = nameObj.name.trim()
      //     $.get("https://gender-api.com/get?name="+name+"&key=PUTKEYHERE",function(data){
      //       genders.push(data.gender)
      //   }); 
      // }, 1000);
        
        var groupNum = Math.floor(Math.random()*2);
        nodes.push({"name":name, "group":groupNum});
      });
    var links = [ ];
    conversations.forEach(function(convo){
        var source = names.indexOf(convo.personA);
        var target = names.indexOf(convo.personB);
        if (source > -1 && target > -1){
          link = {"source": source, "target":target, "value":2};
          links.push(link);
        }
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
    noder(nodes, links, true);
});
}

$(document).ready(function(){
	console.log("is this on?");
    $("#splitAnalysis").click(function(){
    	analyzer($("#script").val());
    });
    $("#tomatoesAnalysis").click(function(){
        tomatoesAreFruit($("#movieName").val());
    });
});
