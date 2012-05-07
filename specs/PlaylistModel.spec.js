define(
	[
		'use!lib/jasmine',
		'use!lib/underscore',
		'model/PlaylistModel'
	],
	function(jasmine, _, PlaylistModel) {
		describe('The PlaylistModel model class', function() {
			var testModel;

			beforeEach(function() {
				testModel = new PlaylistModel({
					title: 'test title',
					description: 'test desc'
				});
			});

			describe('after being instantiated', function() {
				it('it provides the following functions', function() {
					expect( _.isFunction(testModel.trackAdd) ).toBeTruthy();
					expect( _.isFunction(testModel.trackRemoveByIdx) ).toBeTruthy();
					expect( _.isFunction(testModel.trackRemoveByTrackId) ).toBeTruthy();
				});
			});

			describe('has a trackAdd function', function() {
				it('it adds given track ids to the playlist', function() {
					/*
					    track add should accept a number, an array or a string,
					    but should convert any given string to a number
					*/
					var modelTrackIds, testIds = [1111, 2222, 3333];

					testModel.trackAdd(testIds);
					testModel.trackAdd('34333');

					modelTrackIds = testModel.get('trackIds');
					expect(modelTrackIds[0]).toEqual(1111);
					expect(modelTrackIds[1]).toEqual(2222);
					expect(modelTrackIds[2]).toEqual(3333);
					expect(modelTrackIds[3]).toEqual(34333);
					expect( _.isNumber(modelTrackIds[3]) ).toBeTruthy();
				});

				it('it adds a valid entry to the undo queue', function() {

				});
			});

			describe('has a trackRemoveByIdx function', function() {
				it('it removes a track given an index in the array', function() {
					var modelTrackIds, testIds = [1111, 2222, 3333];
					testModel.trackAdd(testIds);

					testModel.trackRemoveByIdx(1);
					modelTrackIds = testModel.get('trackIds');
					
					expect(modelTrackIds.length).toEqual(2);
					expect(modelTrackIds[0]).toEqual(1111);
					expect(modelTrackIds[1]).toEqual(3333);
				});

				it('it adds a valid entry to the undo queue', function() {

				});
			});

			describe('has a trackRemoveByTrackId function', function() {
				var modelTrackIds, testIds = [1111, 2222, 23, 23, 2343, 2222, 3333];

				beforeEach(function() {
					testModel.trackAdd(testIds);
					modelTrackIds = testModel.get('trackIds');
				});

				it('it removes the last instance of the given track id', function() {
					testModel.trackRemoveByTrackId(2222);
					modelTrackIds = testModel.get('trackIds');
					expect(modelTrackIds.length).toEqual(6);
				});

				it('it removes all instances of the the given track if requested', function() {
					testModel.trackRemoveByTrackId(2222, true);
					modelTrackIds = testModel.get('trackIds');
					expect(modelTrackIds.length).toEqual(5);
				});

				it('it adds a valid entry to the undo queue', function() {

				});
			});
		});
	}
);
