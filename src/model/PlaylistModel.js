define(
	[
		'use!lib/underscore',
		'lib/backbone',
	],
	function(
		_,
		Backbone
	) {
		var PlaylistModel = Backbone.Model.extend({
			defaults: {
				title: '',
				description: '',
				trackIds: null,

				/*
				    only populated when the model needs to be rendered
				    to avoid duplicating large amounts of data in memory
				    if playlists have tracks in common
				*/
				trackObjs: null
			},
			trackAdd: function(trackInput) {
				var trackIds, trIdx, convIds = [];
				trackIds = this.get('trackIds');

				if( _.isArray(trackIds) !== true ) {
					// initialise the track array
					trackIds = [];
				}

				// ensure both types of input can be treated the same way
				if( _.isArray(trackInput) === false ) {
					trackInput = [trackInput];
				}

				for(trIdx = 0; trIdx < trackInput.length; trIdx++) {
					// avoid adding invaid values to the tracklist
					if( _.isNaN(Number(trackInput[trIdx])) ) {
						continue;
					}

					convIds.push( Number(trackInput[trIdx]) );
				}

				// add the given value(s) to the existing track array
				trackIds = trackIds.concat(convIds);

				// store the updated track list
				this.set({
					trackIds: trackIds
				});
			},
			trackRemoveByIdx: function(idx) {
				var trackIds = this.get('trackIds');
				if( idx > (trackIds.length - 1) ) {
					// track not in the playlist
					return;
				}
				trackIds.splice(idx, 1);
			},
			trackRemoveByTrackId: function(removeId, removeAll) {
				var trackIds = this.get('trackIds'), lastIdx, numIdx;

				if(removeAll !== true) {
					// remove the last instance of the track id
					lastIdx = _.lastIndexOf(trackIds, Number(removeId));
					if(lastIdx === -1) {
						// track not in the playlist
						return;
					}
					trackIds.splice(lastIdx, 1);
				}
				else {
					// defer to the underscore util function
					trackIds = _.without(trackIds, Number(removeId));
				}

				this.set({
					trackIds: trackIds
				});
			}
		});

		return PlaylistModel;
	}
);

