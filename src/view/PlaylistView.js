define(
	[
		'use!lib/mustache',
		'lib/backbone',
		'text!tpl/Playlist.html'
	],
	function(Mustache, Backbone, PlaylistHTML) {
		var PlaylistView = Backbone.View.extend({
			events: {
				'click a': 'onLinkClicked'
			},
			tagName: 'li',
			listElem: null,

			initialize: function() {
				this.model.bind('destroy', this.remove, this);
			},
			render: function() {
				var rendered = Mustache.render( PlaylistHTML, this.model.toJSON() );
				this.$el.html(rendered);
				return this;
			},
			onLinkClicked: function(ev) {
				ev.preventDefault();

				// the event will be rippled up to the collection which contains this model
				this.model.trigger('selected', this.model);
			}
		});

		return PlaylistView;

	}
);
