define(
	[
		'use!lib/underscore',
		'lib/backbone',
		'model/PlaylistModel'
	],
	function(
		_,
		Backbone,
		PlaylistModel
	) {
		var PlaylistCollect = Backbone.Collection.extend({
			model: PlaylistModel,
			localStorage: new Backbone.LocalStorage('Playlist'),
			trackIdsGetAll: function() {
				var retIds = [];	

				this.each(function(playlist) {
					var theseTracks = playlist.get('trackIds');

					if(_.isArray(theseTracks) === false) {
						return;
					}

					// add the track ids from this playlist to the return list
					retIds = retIds.concat(theseTracks);
				});

				// remove duplicates
				retIds.sort();
				retIds = _.uniq(retIds, true);

				return retIds;
			}
		});

		return PlaylistCollect;
	}
);
