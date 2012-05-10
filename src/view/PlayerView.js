define(
	[
		'use!http://connect.soundcloud.com/sdk.js',
		'use!lib/mustache',
		'lib/backbone',
		'text!tpl/Player.html',
		'text!tpl/TrackItem.html',
		'model/TrackModel'
	],
	function(SC, Mustache, Backbone, PlayerHTML, TrackHTML, TrackModel) {
		var PlayerView = Backbone.View.extend({
			events: {
				'click .load-track-url': 'onTrackLoadSubmit',
				'click .btn-success': 'playerStart',
				'click .btn-danger': 'playerStop'
			},

			tagName: 'div',
			className: 'span5',
	
			// the index in the playlist of the currently playing track
			currTrackIdx: 0,
	
			isPlaying: false,

			// the returned sound from the SC.play callback
			playingSound: null,

			// the 'load a track from a soundcloud url' textbox
			urlInput: null,

			// the ul element holding the tracklist
			tracksElem: null,

			initialize: function() {
				// the global track collection used when playing or loading tracks
				this.tracksCollect = this.options.tracks;

				// start hidden until a playlist is assigned
				this.$el.css('display', 'none');
			},
			render: function() {
				var rendVars = _.isUndefined(this.model) ? {} : this.model.toJSON();

				this.$el.html(Mustache.render(PlayerHTML, rendVars));
				this.currTrackElem = this.$el.find('.curr-track');
				this.tracksElem = this.$el.find('.player-track-list');
				this.bookmarkLink = this.$el.find('.bookmarklet');

				this.urlInput = this.$el.find('.soundcloud-url');
				return this;
			},
			onModelRemoved: function() {
				this.undelegateEvents();
			},
			onTrackLoadSubmit: function() {
				var gotUrl = $.trim( this.urlInput.val() );

				SC.get('/resolve?url='+gotUrl, _.bind(function(ret, error) {
					if(error) {
						this.trackLoadError();
						return;
					}

					this.trackLoadSuccess(ret);
					
					// clear the URL input so another can be entered
					this.urlInput.val('');
				}, this));
			},
			trackLoadSuccess: function(ret) {
				console.log('sc ret', ret);
				// create a new track model and report it being loaded
				var newModel = new TrackModel(_.pick(ret, [
					'id',
					'title',
					'description',
					'permalink_url'
				]));

				newModel.set({
					username: ret.user.username
				});

				console.log('this', this);

				// add the loaded track to the stored collection
				if( !this.tracksCollect.get(ret.id) ) {
					this.tracksCollect.add(newModel);
				}

				// update the current playlist with the loaded track
				var currTrackIds = this.model.get('trackIds');
				if(currTrackIds === null) {
					currTrackIds = [];
				}

				currTrackIds.push(ret.id);
				this.model.set('trackIds', currTrackIds);
				if( !_.isUndefined(this.model.collection) ) {
					this.model.save();
				}

				// display the newly added track in the playlist
				this.trackAddElement(newModel);
			},
			trackLoadError: function() {

			},
			trackAddElement: function(trackModel) {
				var elem = $( Mustache.render(TrackHTML, trackModel.toJSON()) );
				this.tracksElem.append(elem);
			},
			playlistSwitch: function(playlist) {
				// assign the given playlist and re-render
				this.model = playlist;
				this.$el.empty();
				this.render();
				this.$el.css('display', 'block');

				this._regenBookmarklet();

				// render an element for each track in the playlist
				var trackIds = this.model.get('trackIds');
				if( !_.isArray(trackIds) ) {
					// no tracks in the playlist yet
					return;
				}

				_.each(trackIds, function(trackId) {
					var thisTrack = this.tracksCollect.get(trackId);
					if(!thisTrack) {
						/*
						    Tracks in playlists should be loaded either when 
						    they are added or at page load. It is possible
						    this track failed to load or was deleted, ignore for now.
						*/
						return;
					}

					this.trackAddElement(thisTrack);
				}, this);
			},
			playerStart: function(ev) {
				if(ev) {
					ev.preventDefault();
				}

				var thisPlayId, playIds = this.model.get('trackIds') || [];

				if(this.isPlaying === true || playIds.length < 1) {
					// already playing or nothing to play
					return;
				}

				// start playing at the first track
				this.currTrackIdx = 0;
				thisPlayId = playIds[this.currTrackIdx];
				
				SC.stream(
					'/tracks/'+thisPlayId, 
					{
						// notify the view when the track finishes playing
						onfinish: _.bind(this.playerOnFinish, this)
					},
					_.bind(function(sound) {
						// mark the player view as actively playing
						this.isPlaying = true;

						this.playingSound = sound;
						this.playingSound.play();

						// give a visual indication of which track is playing
						this._playerHighlightPlaying();
					}, this)
				);
			},
			playerStop: function(ev) {
				if(ev) {
					ev.preventDefault();
				}

				// stop the current sound from playing and nullify the object
				this.isPlaying = false;
				if(this.playingSound) {
					this.playingSound.stop();
					this.playingSound = null;
				}

				this._playerHighlightPlaying();
			},
			playerOnFinish: function() {
				this.currTrackIdx++;

				// check if there is another track left to play
				var thisPlayId, playIds = this.model.get('trackIds') || [];
				thisPlayId = playIds[this.currTrackIdx];

				if( _.isUndefined(thisPlayId) ) {
					// playlist has completed, nothing left to play
					this._playerListFinished();
					return;
				}

				SC.stream(
					'/tracks/'+thisPlayId, 
					{
						// notify the view when the track finishes playing
						onfinish: _.bind(this.playerOnFinish, this)
					},
					_.bind(function(sound) {
						// mark the player view as actively playing
						this.isPlaying = true;

						this.playingSound = sound;
						this.playingSound.play();
		
						// give a visual indication of which track is playing
						this._playerHighlightPlaying();
					}, this)
				);
			},
			_regenBookmarklet: function() {
				/*
				    split the url up by front-slashes, saving the final
				    two parts which are the user and the track permalink.
				    The two url components are added onto a link for this
				    playlist which adds the track when loaded. The user
				    is redirected to the created link when the bookmarklet
				    is loaded.

				    breakdown:
				    * get the user and permalink url components
				    var urlBits=String(document.location).split('/').slice(-2)
				    
				    * constructing the url
				    BASE_URL+ # slightly hacky, this constant is defined in index.html
				    '#playlist/'+this.model.get('id')+'/add/' # the id for this playlist 
				    +urlBits[0]+'/'+urlBits[1]

				*/
				var bookmarkCode = "javascript:var urlBits=String(document.location).split('/').slice(-2); document.location = '"+BASE_URL+"'+'#playlist/"+this.model.get('id')+"/add/'+urlBits[0]+'/'+urlBits[1];"
				this.bookmarkLink.attr('href', bookmarkCode);
			},
			_playerListFinished: function() {
				// any existing track highlight
				var trackItems = this.tracksElem.find('li');
				trackItems.css('background', '#FFF');
				this.isPlaying = false;
			},
			_playerHighlightPlaying: function() {
				var trackItems = this.tracksElem.find('li');
				trackItems.css('background', '#FFF');

				if(this.isPlaying !== true) {
					// nothing playing so unable to highlight
					return;
				}
	
				// give the currently playing track's element a pale background
				trackItems.eq(this.currTrackIdx).css('background', '#C4D4FF');
			}
		});

		return PlayerView;
	}
);
