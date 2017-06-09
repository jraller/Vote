const webpackConfig = require('./webpack.config')('test');
const wallabyWebpack = require('wallaby-webpack');

webpackConfig.module.rules = webpackConfig.module.rules.filter(r => !'.ts'.match(r.test) && !'.js'.match(r.test));
webpackConfig.resolve.extensions = ['.vue', '.jsx', '.js', '.json'];
// json only needed for brittleness in Chai, remove when fixed
delete webpackConfig.devServer;
delete webpackConfig.entry;

// https://wallabyjs.com/docs/integration/webpack.html

module.exports = function () {

	const wallabyPostprocessor = wallabyWebpack(webpackConfig);

	return {
		debug: true,
		env: {
			type: 'browser',
		},
		files: [
			{pattern: 'tsconfig.json', load: false, instrument: false},
			{pattern: 'app/**/*.ts', load: false},
			{pattern: 'app/**/*.vue', load: false, instrument: false},
		],
		hints: {
			ignoreCoverage: /ignore coverage/
		},
		postprocessor: wallabyPostprocessor,
		setup: function () {
			// window.expect = chai.expect;
			window.__moduleBundler.loadTests();
		},
		testFramework: 'mocha',
		tests: [
			{pattern: 'test/**/*.test.ts', load: false}
		],
	};
};
