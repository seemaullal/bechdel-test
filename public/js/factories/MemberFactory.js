app.factory('MemberFactory', function($http){
	return {
		getUserInformation : function(userId) {
			return $http.get('/user/' + userId).then(function(response) {
				return response.data;
			});
		},

		getCurrentUser : function() {
			return $http.get('/currentUser').then(function(response) {
				return response.data;
			});
		}


	};
});