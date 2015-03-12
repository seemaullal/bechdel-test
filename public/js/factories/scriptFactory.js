app.factory("scriptFactory", function($http){
	return {
		analyzeScript: function(script) {
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
		},
		characterizeGender: function(script){
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
				console.log(sorted)
			var topTenNames = sorted.reverse().slice(0,10);
			console.log(topTenNames)
			// for(obj in counts){
			// 	if(counts.hasOwnProperty(obj)){
			// 		topTenNames.push(obj);
			// 	}
			// }
			// topTenNames.sort(function(val1, val2){
			// 	return val1[1]-val2[1]
			// })
			// console.log("top10",topTenNames)
			// names = names.filter(function(name, index, arr){
			// 	return counts[name] >= 7;
			// });
			// names = _.uniq(names);
			// console.log(names);
			// console.log(names.length)
			// names.forEach(function(name){
			// 	$http.get("https://gender-api.com/get?name="+name+"&key=VFdWHejMrYUKKGApzE").then(function(response){
			// 			console.log(response.data);
			// 	})
			// })
		}
	};
});