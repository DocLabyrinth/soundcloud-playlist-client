define(
	[
		'use!http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js',
		'use!lib/mustache',
		'lib/backbone',
		'text!tpl/PlaylistMenu.html',
		'model/PlaylistModel'
	],
	function($, Mustache, Backbone, MenuHTML, PlaylistModel) {
		var PlaylistMenuView = Backbone.View.extend({
			events: {
				'click .create-link': 'onClickCreateLink',
				'click .btn-success': 'onBtnCreate',
				'click .btn-danger': 'onBtnCancel'
			},
			tagName: 'div',
			className: 'span4',
			listElem: null,

			// a collection of the displayed playlists
			playlists: null,
			
			// the form elements for the playlist create form
			formDiv: null,
			titleInput: null,
			descInput: null,

			initialize: function() {
			//	this.model.bind('destroy', this.remove, this);
				this.playlists = this.options.playlists || null;
			},
			render: function() {
				this.$el.html(Mustache.render(MenuHTML, {}));

				// select and store references to important elements
				this.listElem = this.$el.find('.playlist-menu');
				this.formDiv = this.$el.find('.create-form'),
				this.titleInput = this.$el.find('input[name=new-title]'),
				this.descInput = this.$el.find('input[name=new-desc]');

				return this;
			},
			onClickCreateLink: function(ev) {
				ev.preventDefault();

				this.formDiv.show();
			},
			onBtnCreate: function(ev) {
				ev.preventDefault();

				var newModel, newTitle, newDesc;

				newTitle = $.trim(this.titleInput.val());
				newDesc = $.trim(this.descInput.val());

				if(newTitle.length < 1) {
					// avoid creating a playlist without a title
					return;
				}

				newModel = new PlaylistModel({
					title: newTitle,
					desc: newDesc
				});
				this.playlists.add(newModel);

				/* 
				    save after adding to the playlist collection
				    so its localStorage functions are used
				    for persistence 
				*/
				newModel.save( newModel.toJSON() );

				// clear the form and hide it after creation
				this._clearForm();
				this.formDiv.hide();
			},
			onBtnCancel: function(ev) {
				ev.preventDefault();

				this._clearForm();
				this.formDiv.hide();
			},
			_clearForm: function() {
				this.titleInput.val('');
				this.descInput.val('');
			}
		});

		return PlaylistMenuView;
	}
);
