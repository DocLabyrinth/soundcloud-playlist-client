define(
	[
		'use!lib/underscore',
		'lib/backbone',
		'use!http://connect.soundcloud.com/sdk.js',
	],
	function(_, Backbone, SC) {
		/*
		    Base collection class to defer backbone store/fetch functions
		    to Soundcloud's class. The url property should be set to the
		    relevant api endpoint
		*/
		var SCCollect = Backbone.Collection.extend({
			sync: function(method, model, options) {
				var lookup, callMethod, callFunc;

				lookup = {
					create: 'post',
					read: 'get',
					update: 'put',
					delete: 'delete'
				};

				callMethod = lookup[method];
				if( _.isUndefined(callMethod) ) {
					// possibly throw an error here?
					return;
				}

				// select the right function to use on the soundcloud client
				callFunc = SC[callMethod];

				if(method === 'delete') {
					callFunc(model.url(), options.success);			
				}

				callFunc.call(SC,
					model.url,
					options.callOpts || {},
					function(ret, error) {
						if(error !== null) {
							throw new Error('Error: '+error);
						}

						options.success(ret);
					}
				);
			}
		});

		return SCCollect;
	}
);
