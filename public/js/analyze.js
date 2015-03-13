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
	links = []
	conversations.forEach(function(convo){
		var source = topNames.indexOf(convo.personA);
		var target = topNames.indexOf(convo.personB);
		if (source > -1 && target > -1){
			link = {"source": source, "target":target, "value":2}
			links.push(link)
		}
	})
	return links
	//
	//
}
var analyzer = function(script){
	var nameCatcher = /\s[A-Z]+\s/g;
	var names = script.match(nameCatcher);
	var nameAndGenders = {};
	names = names.filter(function(word){
		word = word.replace(/(\r\n|\n|\r)/gm,"").trim();
		return word.length > 1 && (commonWords.indexOf(word.toLowerCase())== -1);
	});
	var counts = _.countBy(names);
	console.log("counts", counts)
	var sorted = _.chain(counts).
		map(function(cnt,name){
			return{
				name:name,
				count:cnt
				}
			})
		.sortBy('count').value();
	console.log(sorted);
	var topNames = sorted.reverse().slice(0,50);
	console.log(topNames);
	var nodes = [];
	topNames.forEach(function(nameObj, index, arr){
		nodes.push({"name":nameObj.name, "group":index});
		arr[index] = nameObj.name;

	})
	var links = linkFinder(script, topNames)
	noder(nodes, links);
	
}
$(document).ready(function(){
	console.log("is this on?")
    $("#genderize").click(function(){
    	analyzer($("#script").val())
    });

});
function noder(nodes, links){
	console.log("nodes",nodes)
	var width = 1000,
	height = 1000;
	var color = d3.scale.category20();
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
	.attr("r", 5)
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
