define(
	[
		'use!lib/jasmine',
		'model/PlaylistModel',
		'collection/PlaylistCollect'
	],
	function(jasmine, PlaylistModel, PlaylistCollect) {
		describe('The PlaylistCollect collection', function() {		
			// save several playlists with some tracks in common
			var listA, listB, listC, testCol;

			beforeEach(function() {
				testCol = new PlaylistCollect();

				listA = new PlaylistModel({
					title: 'list A',
					desc: 'List A',
					trackIds: [12, 13, 14, 15, 16]
				});

				listB = new PlaylistModel({
					title: 'list B',
					desc: 'List B',
					trackIds: [15, 16, 17, 18, 19]
				});

				listC = new PlaylistModel({
					title: 'list C',
					desc: 'List C',
					trackIds: [18, 19, 20, 21, 22]
				});

				testCol.add([listA, listB, listC]);
			});

			describe('after being instantiated', function() {
				it('it provides the following functions', function() {
					// it should redefine the sync function to use backbone.localStorage
					expect( _.isFunction(testCol.trackIdsGetAll) ).toBeTruthy();
				});

				it('it creates the following objects', function() {
					expect( _.isObject(testCol.localStorage) ).toBeTruthy();
				});
			});

			describe('has a trackIdsGetAll function', function() {
				it('it returns the track IDs of tracks in all saved playlists without duplicates', function() {
					var trackIds = testCol.trackIdsGetAll();
					expect(trackIds.length).toEqual(11);
				});
			});
		});
	}
);
