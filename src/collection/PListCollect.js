require(
	[
		'use!lib/underscore',
		'use!lib/backbone',
		'model/PListModel'
	],
	function(
		_,
		Backbone,
		PListModel
	) {
		var PListCollect = Backbone.Collection.extend({
			model: 'PListModel',
			localStorage: new Backbone.LocalStorage('Playlist')
		});

		return PlistCollect;
	}
);
