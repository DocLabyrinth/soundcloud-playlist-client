define(
	[
		'model/PlistModel'
		'collection/PListCollect'
	],
	function(PListCollect) {
		describe('The PListCollect collection', function() {		
			// save several playlists with some tracks in common
			var listA, listB, listC, testCol;

			beforeEach(function() {
				testCol = new PListCollect();

				listA = new PListModel({
					title: 'list A',
					desc: 'List A',
					tracks: [12, 13, 14, 15, 16]
				});

				listB = new PListModel({
					title: 'list B',
					desc: 'List B',
					tracks: [15, 16, 17, 18, 19]
				});

				listC = new PListModel({
					title: 'list C',
					desc: 'List C',
					tracks: [18, 19, 20, 21, 22]
				});

				testCol.add([listA, listB, listC]);
			});

			describe('before being instantiated', function() {
				it('it provides the following functions', function() {
					// it should redefine the sync function to use backbone.localStorage
					expect( PListCollect.hasOwnProperty('sync') ).toBeTruthy();
				});

				it('it creates the following objects', function() {
					expect( _.isObject(PListCollect.store) ).toBeTruthy();
				});
			});

			describe('has a trackIdsGetAll function', function() {
				it('it returns the track IDs of tracks in all saved playlists without duplicates', function() {
					var trackIds = testCol.trackIdsGetAll();
					expect(trackIds.length).toEqual(6);
				});
			});
		});
	}
);
