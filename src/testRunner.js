define(
	[
		'use!lib/jasmine'
		,'specs/PlaylistCollect.spec.js'
		,'specs/PlaylistModel.spec.js'
		,'specs/PlayerView.spec.js'
		,'specs/SCCollect.spec.js'
	],
	function (jasmine) {
		if(window.debug === true) {
			var jasmineEnv = jasmine.getEnv(), trivialReporter = new jasmine.TrivialReporter();
			jasmineEnv.updateInterval = 1000;
			jasmineEnv.addReporter(trivialReporter);
			jasmineEnv.specFilter = function(spec) {return trivialReporter.specFilter(spec);};
			jasmineEnv.execute();
			console.log(jasmineEnv);
		}
	}
);
