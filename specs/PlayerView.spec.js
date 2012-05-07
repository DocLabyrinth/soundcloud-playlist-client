define(
	[
		'use!lib/jasmine',
		'use!lib/underscore',
		'view/PlayerView',
		'model/PlaylistModel',
		'collection/TrackCollect'
	],
	function(jasmine, _, PlayerView, PlaylistModel, TrackCollect) {
		describe('The PlayerView view', function() {
			var testView;

			beforeEach(function() {
				var tracks = new TrackCollect();
				testView = new PlayerView({
					tracks: tracks
				});
			});

			describe('after being instantiated', function() {
				it('it provides the following functions', function() {
					expect( _.isFunction(testView.onTrackLoadSubmit) );
					expect( _.isFunction(testView.trackLoadSuccess) );
					expect( _.isFunction(testView.trackLoadError) );
					expect( _.isFunction(testView.playlistSwitch) );
					expect( _.isFunction(testView.playerSkipTrack) );
					expect( _.isFunction(testView.playerStart) );
					expect( _.isFunction(testView.playerStop) );
					expect( _.isFunction(testView.playerOnFinish) );
					expect( _.isFunction(testView.render) );
				});

				/*
				it('it binds the following events', function() {
					spyOn(testView, 'bind');
					testView.render();

					expect(testView.bind).toHaveBeenCalledWith();
				});
				*/
			});

			describe('has a playlistSwitch function', function() {
				it('it re-renders the view when a new playlist model is passed', function() {
					var testList = new PlaylistModel({
						title: 'list A',
						description: 'List A',
						tracks: [12, 13, 14, 15, 16]
					});

					spyOn(testView, 'render');

					testView.playlistSwitch(testList);
					expect(testView.render).toHaveBeenCalled();

					// TODO: check events have been re-bound here
				});
			});

			describe('has an onTrackLoadSubmit function', function() {
				it('it calls the soundcloud /resolve endpoint', function() {
					var testUrl = 'http://soundcloud.com/test-url';

					testView.render();
					testView.urlInput.val(testUrl);

					spyOn(SC, 'get');
					testView.onTrackLoadSubmit();
					expect(SC.get.argsForCall[0][0]).toEqual('/resolve?url='+testUrl);
				});
			});

			describe('has a trackLoadSuccess function', function() {
				it('it assigns a new track id to the current playlist', function() {
					var testList = new PlaylistModel({
						title: 'test list',
						description: 'test desc'
					}),
					testTrack = {
						id: 1111,
						title: 'A Track',
						description: 'A Track',
						permalink_url: 'http://soundcloud.com/a-track',
						user: {
							username: 'testuser'
						}
					};

					// add a blank playlist and simulate adding a track to it
					testView.playlistSwitch(testList);
					testView.trackLoadSuccess(testTrack);

					var modelTrackIds = testView.model.get('trackIds');
					expect(modelTrackIds.length).toEqual(1);
					expect(modelTrackIds[0]).toEqual(1111);

					// check a new track model has been added
					expect(testView.tracksCollect.length).toEqual(1);
					expect(testView.tracksCollect.get(1111)).not.toBeNull();
				});
			});

			describe('has a playerStart function', function() {
				beforeEach(function() {
					var listA = new PlaylistModel({
						title: 'list A',
						desc: 'List A',
						trackIds: [12, 13, 14, 15, 16]
					});

					testView.playlistSwitch(listA);
				});

				it('it starts a chain of calls which plays every available track', function() {
					// simulate the player having played and finished the track
					spyOn(SC, 'stream').andCallFake(function() {
						testView.playerOnFinish();
					});

					spyOn(testView, '_playerListFinished').andCallThrough();

					// ensure the entire list has been played
					testView.playerStart();
					expect(SC.stream.callCount).toEqual(5);

					// ensure the view's function to reset visual elements has been called
					expect(testView._playerListFinished).toHaveBeenCalled();
				});
			});
		});
	}
);
