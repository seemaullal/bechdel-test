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
  $("#ladyConvoCount").text("We *think* there were "+ladyConvoCount+" conversations between women");
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
      console.log("dataFromApi",data);
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
    $("#womanCount").text("There are "+genderCount+" major characters with womanly names: "+womenNames);
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
    $("#loading").hide();
    $("#tryAgain").show(); 
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
          console.log('link',link);
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
  var ladyConvoCount = 0;
  var linesAboutMen = 0;
  var genderCount = 0;
  var formattedChars = [ ];
  $.get('/api/getcast/' + movieName, function (data) {
    chars = data;
    chars.forEach( function(character,index,arr) {
      if(character) {
        formattedChars.push(character.toUpperCase().trim().split(" ")[0]);  
      }
    });
    chars = formattedChars;
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
    var nodeNames = [ ];
    async.each(chars, function(name, done) {
      name = name.replace('/','');
      $.get('/api/gender/'+name, function(data){
        if(data.gender == "female"){
          groupNum = 0;
          genderCount++;
          womenNames.push(name);
        } else{
          groupNum = 1;
        }
        nodes.push({"name":name, "group":groupNum});
        nodeNames.push(name);
        done();
       });
    }, 
    function() {
      var links = [ ];
      conversations.forEach(function(convo){
          var source = nodeNames.indexOf(convo.personA);
          var target = nodeNames.indexOf(convo.personB);
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
      links.forEach(function (link) {
        if (link.source > nodes.length || link.target > nodes.length)
          console.log(link);
      });
      if(womenNames.length >=2){
        tests++;
      }
      $("#womanCount").text("There are "+genderCount+" major characters with womanly names: " + womenNames.join(", "));
      console.log('ladyconvos',ladyConvoCount);
      $("#ladyConvoCount").text("We *think* there were "+ladyConvoCount+" conversations between women");
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
      $("#loading").hide();
      $("#tryAgain").show();
      $("#movieNameDisplay").text($("#movieName").val());
    });

});
}

$.getScript("js/commonwords.js", function(){

  $(document).ready(function(){
    $('#what').click(function() {
      $('#what').hide();
      $('.mainPart').hide();
      $('#instructions').show();
    });
    $('#close-about').click(function() {
      $('#instructions').hide();
      $('#what').show();
      $('.mainPart').show();
    });
    $("#splitAnalysis").click(function(){
      analyzer($("#script").val());
      $("#movieNameDisplay").text($("#movieName").val());
      $("#results").show()
      $("#form").hide();
    });
    $("#tomatoesAnalysis").click(function(){
      tomatoesAreFruit($("#movieName").val());
      $("#results").show();
      $("#form").hide();
    });
    $("#tryAgain").click(function(){
      location.reload();
    });
  });

});

