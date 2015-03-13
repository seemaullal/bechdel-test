var analyzer = function(script){
	var nameCatcher = /\s[A-Z]+\s/g;
	var names = script.match(nameCatcher);
	var nameAndGenders = {};
	names = names.filter(function(word){
		word = word.replace(/(\r\n|\n|\r)/gm,"").trim();
		return word.length > 1;
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
	var topTenNames = sorted.reverse().slice(0,10);
	console.log(topTenNames);
	var nodes = [];
	topTenNames.forEach(function(nameObj, index, arr){
		nodes.push({"name":nameObj.name, "group":index});
		arr[index] = nameObj.name;

	})
	 noder(nodes)
	
}
$(document).ready(function(){
	console.log("is this on?")
    $("#genderize").click(function(){
    	analyzer($("#script").val())
    });

});
function noder(nodes){
	console.log("nodes",nodes)
	var width = 960,
	height = 500;
	var color = d3.scale.category20();
	var force = d3.layout.force()
	.charge(-120)
	.linkDistance(30)
	.size([width, height]);
	var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);
	d3.json("mis.json", function(error, graph) {
	force
	.nodes(nodes)
	.links(graph.links)
	.start();
	
	var link = svg.selectAll(".link")
	.data(graph.links)
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
