const webpack = require('webpack');
const merge = require('webpack-merge');

const WebpackLighthousePlugin = require('webpack-lighthouse-plugin');

module.exports = merge([
	{
		plugins: [
			new WebpackLighthousePlugin({
				url: 'http://localhost:8000'
			})
		],
	}
]);
