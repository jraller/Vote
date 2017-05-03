const webpackConfig = require('./webpack.config');
const wallabyWebpack = require('wallaby-webpack');

module.exports = function (wallaby) {

	const wallabyPostprocessor = wallabyWebpack(webpackConfig);

	return {
		debug: true,
		env: {
			type: 'browser',
		},
		files: [
			{pattern: 'tsconfig.json', load: false},
			{pattern: 'app/**/*.ts', load: false}
		],
		hints: {
			ignoreCoverage: /ignore coverage/
		},
		postprocessor: wallabyPostprocessor,
		setup: function () {
			window.__moduleBundler.loadTests();
		},
		testFramework: 'mocha',
		tests: [
			{pattern: 'test/**/*.test.ts', load: false}
		],
	};
};

