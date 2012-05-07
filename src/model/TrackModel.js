define(
	[
		'use!lib/underscore',
		'lib/backbone'
	],
	function(_, Backbone) {
		var TrackModel = Backbone.Model.extend({
			url: '/tracks',
			defaults: {
				title: '',
				description: '',
				permalink_url: ''
			}
		});

		return TrackModel;
	}
);
