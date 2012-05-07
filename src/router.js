define(
	[
		'use!lib/underscore',
		'lib/backbone'
	],
	function(_, Backbone) {
		var router = Backbone.Router.extend({
			routes: {
				'playlist/:listId': 'playlistShow',
				'playlist/:listId/add/:user/:permalink': 'playlistAddFromUrl'
			},

			/*
			    other objects listen to the router's events so
			    these are just defined to stop errors during startup
			*/
			playlistShow: function() {

			},
			playlistAddFromUrl: function() {

			}
		});

		return router;
	}
);
