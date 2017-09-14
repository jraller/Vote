const webpackConfig = require('./webpack.config')('test');
const wallabyWebpack = require('wallaby-webpack');


// https://wallabyjs.com/docs/integration/webpack.html

module.exports = function (wallaby) {

	delete webpackConfig.devServer;
	delete webpackConfig.entry;
	// json only needed for brittleness in Chai, remove when fixed
	webpackConfig.resolve.extensions = ['.vue', '.jsx', '.js', '.json'];

	webpackConfig.module.rules = webpackConfig.module.rules.filter(r => !'.ts'.match(r.test) && !'.js'.match(r.test));
	webpackConfig.module.rules.find(r => r.loader === 'vue-loader').options.loaders.js = '';

	webpackConfig.resolve.alias = {'@': require('path').join(wallaby.projectCacheDir, 'app')};
	// webpackConfig.externals = {vue: 'Vue'};

	const wallabyPostprocessor = wallabyWebpack(webpackConfig);

	return {
		compilers: {
			'**/*.js': wallaby.compilers.babel({}),
			'**/*.ts': wallaby.compilers.typeScript({}),
			'**/*.vue': require('wallaby-vue-compiler')(wallaby.compilers.babel({}))
		},
		debug: true,
		env: {
			type: 'browser' // browser or node
			// runner: 'node',
		},
		files: [
			{pattern: 'tsconfig.json', load: false, instrument: false},
			{pattern: 'node_modules/vue/dist/vue.js', instrument: false},
			{pattern: 'app/**/*.ts', load: false},
			{pattern: 'app/**/*.vue', load: false}
		],
		hints: {
			ignoreCoverage: /ignore coverage/
		},
		postprocessor: wallabyPostprocessor,
		setup: function () {
			// window.expect = chai.expect;
			// eslint-disable-next-line
			Vue.config.errorHandler = function (err) {
				throw err;
			};
			window.__moduleBundler.loadTests();
		},
		testFramework: 'mocha',
		tests: [
			{pattern: 'test/**/*.test.ts', load: false}
		]
	};
};
