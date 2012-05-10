define(
	[
		'use!lib/mustache',
		'lib/backbone',
		'text!tpl/Playlist.html',
		'view/ConfirmView'
	],
	function(Mustache, Backbone, PlaylistHTML, ConfirmView) {
		var PlaylistView = Backbone.View.extend({
			events: {
				'click .select-link': 'onSelectLinkClicked',
				'click .soft-del-link': 'onSoftDelLinkClicked'
			},
			tagName: 'li',
			listElem: null,

			// view showing a confirmation before actually deleting
			confView: null,

			initialize: function() {
				this.model.bind('destroy', this.remove, this);
			},
			render: function() {
				var rendered = Mustache.render( PlaylistHTML, this.model.toJSON() );
				this.$el.html(rendered);

				// add the confirmation alert
				this.confView = new ConfirmView({
					confAction: _.bind(function() {
						// remove the confirmation alert and destroy the playlist model
						this.confView.remove();
						this.model.destroy();
					}, this),
					confMsg: 'Really delete this playlist?',
					linkText: 'Delete Playlist',
				})
				.render();

				this.$el.append(this.confView.el);

				return this;
			},
			onSelectLinkClicked: function(ev) {
				ev.preventDefault();

				// the event will be rippled up to the collection which contains this model
				this.model.trigger('selected', this.model);
			},
			onSoftDelLinkClicked: function() {
				this.confView.$el.show();
			}
		});

		return PlaylistView;

	}
);
