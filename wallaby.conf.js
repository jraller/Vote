const webpackConfig = require('./webpack.config');
const wallabyWebpack = require('wallaby-webpack');

// https://wallabyjs.com/docs/integration/webpack.html

module.exports = function (wallaby) {

	const wallabyPostprocessor = wallabyWebpack(webpackConfig);

	return {
		debug: true,
		env: {
			type: 'browser',
		},
		files: [
			// {pattern: 'node_modules/chai/chai.js', instrument: false},
			{pattern: 'tsconfig.json', load: false},
			{pattern: 'app/**/*.ts', load: false},
			{pattern: 'app/**/*.vue', load: false, instrument: false}
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
