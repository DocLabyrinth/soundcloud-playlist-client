define(
	[
		'use!lib/jasmine',
		'collection/SCCollect',
		'use!http://connect.soundcloud.com/sdk.js'
	],
	function(jasmine, SCCollect, SC) {
		var testCol;

		beforeEach(function() {
			testCol = new SCCollect();
		});

		describe('The Soundcloud collection base class', function() {
			describe('after being instantiated', function() {
				it('it provides the following functions', function() {
					// it should redefine the sync function to defer to Soundcloud's client class
					expect( _.isFunction(testCol.sync) ).toBeTruthy();
				});
			});

			describe('the sync function', function() {
				it('it maps the passed backbone method to a method on the soundcloud class', function() {
					spyOn(SC, 'get');
					spyOn(SC, 'put');
					spyOn(SC, 'post');
					spyOn(SC, 'delete');

					testCol.fetch();
					expect(SC.get).toHaveBeenCalled();
				});

				it('it throws an error if an unknown method is requested', function() {

				});
			
				it('it filters out variables which serialise badly before passing options to the soundcloud class', function() {

				});

				it('it calls the success function passed from backbone on success', function() {

				});

				it('it calls the error function passed from backbone on error', function() {

				});
			});
		});
	}
);
