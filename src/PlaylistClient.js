define(
	[
		'use!http://connect.soundcloud.com/sdk.js',
		'use!lib/underscore',
		'collection/PlaylistCollect',
		'collection/TrackCollect',
		'model/PlaylistModel',
		'view/PlaylistMenuView',
		'view/PlaylistView',
		'view/PlayerView',
		'router'
	], function(
		SC,
		_,
		PlaylistCollect,
		TrackCollect,
		PlaylistModel,
		PlaylistMenuView,
		PlaylistView,
		PlayerView,
		Router
	) {
		var client = function(opts) {
			this.init(opts);
		};

		client.prototype = {
			clientID: null,

			// the user's current playlists
			playlists: null,

			// track objects from Soundcloud's api
			tracks: null,

			// views for the menu and player
			menu: null,
			player: null,

			// backbone router instance
			router: null,

			init: function(opts) {
				this.playlists = new PlaylistCollect(),
					this.tracks = new TrackCollect();

				SC.initialize( _.pick(opts, [
					'client_id',
					'redirect_uri'
				]) ); 
				SC.connect( _.bind(this.onConnect, this) );
			},
			onConnect: function() {

				// draw the empty menu
				this.menu = new PlaylistMenuView({
					playlists: this.playlists
				});
				$('body').append(this.menu.render().el);

				// draw the main player, starts hidden
				this.player = new PlayerView({
					tracks: this.tracks
				});
				$('body').append(this.player.render().el);

				var clientRef = this;

				/*
				    whenever an item is added or the collection
				    is reset, render the new models as items
				    in the menu list
				*/
				this.playlists.bind('add', function(model) {
					var thisView = new PlaylistView({
						model: model
					});
					clientRef.menu.listElem.append( thisView.render().el );
				});
				this.playlists.bind('reset', function(collect) {
					this.each(function(model) {
						var thisView = new PlaylistView({
							model: model
						});
						clientRef.menu.listElem.append( thisView.render().el );
					});
				});

				this.playlists.bind('selected', function(model) {
					clientRef.player.playlistSwitch(
						model
					);

					clientRef.router.navigate('playlist/'+model.get('id'));
				});

				this.playlists.fetch({
					success: function(ret) {
						// load information about referenced tracks
						clientRef.tracksLoadAll(function() {
							/*
							    setup the router once the tracks are all loaded
							    so that users who load a link to a playlist
							    will not see a blank list where the tracks should be
							*/
							clientRef.routerSetup.call(clientRef);
						});
					}
				});
			},
			routerSetup: function() {
				this.router = new Router();

				/*
				    this route tries looking up the playlist specified
				     by the id in the url and displays it if found 
				*/
				this.router.bind('route:playlistShow', _.bind(function(listId) {
					var showList = this.playlists.get(listId);
					if(!showList) {
						// unknown playlist requested
						return;
					}

					this.player.playlistSwitch(showList);
				}, this));

				this.router.bind('route:playlistAddFromUrl', _.bind(function(listId, username, permalink) {
					var showList, buildUrl;

					showList = this.playlists.get(listId);
					if(!showList) {
						// unknown playlist requested
						return;
					}

					// display the list the item is being added to
					this.player.playlistSwitch(showList);

					/*
					    assign the url to the textbox as if the
					    user had entered it manually
					*/
					buildUrl = ['http://soundcloud.com', username, permalink].join('/');
					this.player.urlInput.val(buildUrl);

					/*
					    call the handler function as though the user
					    had just clicked the 'Load Track' button
					*/
					this.player.onTrackLoadSubmit();
				}, this));

				Backbone.history.start();

			},
			tracksLoadAll: function(successCb, errorCb) {
				// avoid having to check if these have been passed later on
				successCb = _.isFunction(successCb) ? successCb : function() {};
				errorCb = _.isFunction(errorCb) ? errorCb : function() {};

				/*
				    load information from soundcloud about all referenced tracks.
				    Soundcloud throttles search results, so ifthe number of
				    stored tracks is > 200 then split up the queries
				*/
				var trackIds = this.playlists.trackIdsGetAll(),
					numLoaded = 0, currIds, fetchOpts, 
					currIds = trackIds.slice(numLoaded, 200);

				if(trackIds.length < 1) {
					// nothing to fetch yet
					successCb();
					return;
				}

				fetchOpts = {
					success: _.bind(function(collect, ret) {
						numLoaded += 200;
						currIds = currIds.slice(numLoaded, 200);
						if(currIds.length < 1) {
							// load completed
							successCb();
							return;
						}

						// continue fetching tracks
						this.tracks.fetch(fetchOpts);
					}, this),
					error: function(collect, ret) {
						errorCb();
					},

					// prevent the collection from resetting
					add: true,

					// options to be passed to the api request
					callOpts: {
						limit: 200,
						ids: currIds.join(',')
					}
				};

				this.tracks.fetch(fetchOpts);
			}
		}

		return client;
	}
);
