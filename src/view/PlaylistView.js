define(
	[
		'use!lib/mustache',
		'lib/backbone',
		'text!tpl/Playlist.html'
	],
	function(Mustache, Backbone, PlaylistHTML) {
		var PlaylistView = Backbone.View.extend({
			events: {
				'click .select-link': 'onSelectLinkClicked',
				'click .delete-link': 'onDeleteLinkClicked',
				'click .alert button.close': 'onCancelLinkClicked',
				'click .soft-del-link': 'onSoftDelLinkClicked'
			},
			tagName: 'li',
			listElem: null,
			confDiv: null,

			initialize: function() {
				this.model.bind('destroy', this.remove, this);
			},
			render: function() {
				var rendered = Mustache.render( PlaylistHTML, this.model.toJSON() );
				this.$el.html(rendered);

				this.confDiv = this.$el.find('.alert-error');
				// start with the delete confirmation div hidden
				this.confDiv.hide();

				return this;
			},
			onSelectLinkClicked: function(ev) {
				ev.preventDefault();

				// the event will be rippled up to the collection which contains this model
				this.model.trigger('selected', this.model);
			},
			// the real delete link inside the confirmation alert
			onDeleteLinkClicked: function(ev) {
				ev.preventDefault();

				this.remove();
				this.model.destroy();
			},
			// the X in the confirmation alert
			onCancelLinkClicked: function(ev) {
				this.confDiv.hide();
			},
			onSoftDelLinkClicked: function() {
				this.confDiv.show();
			}
		});

		return PlaylistView;

	}
);
