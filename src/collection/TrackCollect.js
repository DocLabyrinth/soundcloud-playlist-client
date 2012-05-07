define(
	[
		'use!lib/underscore',
		'lib/backbone',
		'collection/SCCollect',
		'model/TrackModel'
	],
	function(_, Backbone, SCCollect, TrackModel) {
		var TrackCollect = SCCollect.extend({
			url: '/tracks',
			model: TrackModel
		});

		return TrackCollect;
	}
);
