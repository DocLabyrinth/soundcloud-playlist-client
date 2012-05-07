define(
	[
		'use!lib/underscore',
		'lib/backbone'
	],
	function(_, Backbone) {
		var UserModel = Backbone.Model.extend({
			url: '/me'
		});

		return UserModel;
	}
);
