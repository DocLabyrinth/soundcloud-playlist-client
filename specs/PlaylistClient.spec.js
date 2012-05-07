define(
	[
		'use!lib/jasmine',
		'use!lib/underscore',
		'PlaylistClient'
	],
	function(jasmine, _, PlaylistClient) {
		describe('The base PlaylistClient class', function() {
			describe('before being instantiated', function() {
				it('it provides the following functions', function() {
					expect( _.isFunction(PlaylistClient.onConnect) );
					expect( _.isFunction(PlaylistClient.tracksLoadAll) );
				});
			});
		});
	}
);
