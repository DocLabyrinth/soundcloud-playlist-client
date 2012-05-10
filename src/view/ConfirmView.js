define(
	[
		'use!lib/mustache',
		'lib/backbone',
		'text!tpl/Confirm.html'
	],
	function(Mustache, Backbone, ConfirmHTML) {
		var ConfirmView = Backbone.View.extend({
			events: {
				'click .close': 'onCancelLink',
				'click .confirm-link': 'onConfirmLink'
			},

			tagName: 'div',
			className: 'alert alert-error',

			// the X the user clicks to hide the alert box
			cancelLink: null,

			// the link the user clicks to confirm the supplied action
			confLink: null,

			// the function to call if the user confirms the action
			confAction: null,

			initialize: function() {
				this.confAction = this.options.confAction || function() {};
			},
			render: function() {
				var rendVars = {};
				rendVars.confMsg = this.options.confMsg || 'Confirm this action?';
				rendVars.linkText = this.options.linkText || 'Confirm';

				this.$el.html(Mustache.render(ConfirmHTML, rendVars));

				// begin with the confirmation hidden
				this.$el.hide();

				return this;
			},
			remove: function() {
				this.undelegateEvents();
			},
			onCancelLink: function(ev) {
				ev.preventDefault();

				this.$el.hide();
			},
			onConfirmLink: function(ev) {
				ev.preventDefault();

				this.$el.hide();
				this.confAction();
			}
		});

		return ConfirmView;
	}
);
