var script = "  TED "+
          "Good morning."+
         "Annie pretends to wake up."+
"TED (CONT'D) "+
          "Wow, you look beautiful. "+
" ANNIE " +
"(ACTING EMBARRASSED) "+
          "What? No. I don't. Oh my God its the "+
          "morning. I look terrible. I just woke up. "+
"TED "+
          "Last night was fun.";
var analyzer = function(script){
	var nameCatcher = /\s[A-Z]+\s/g;
	var names = script.match(nameCatcher);
	var lines = script.split(nameCatcher)
	names = names.filter(function(word){
		word = word.trim()
		return word.length > 1;
	})
	var conversations = []
	for(nameIndex = 0; nameIndex < (names.length); nameIndex++){
		var convo = {};
		convo.personA = names[nameIndex];
		convo.personB = names[nameIndex+1]
		convo.line = lines[nameIndex];
		conversations.push(convo);
	}
	console.log("names",names)
	console.log("lines",lines)
	console.log("conversations",conversations)

}
analyzer(script);