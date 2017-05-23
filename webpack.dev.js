const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');

module.exports = merge([
	{
		devtool: 'source-map',
		devServer: {
			contentBase: path.resolve(__dirname, 'app'),
			compress: true,

			// Enable history API fallback so HTML5 History API based
			// routing works. Good for complex setups.
			historyApiFallback: true,

			// Parse host and port from env to allow customization.
			//
			// If you use Docker, Vagrant or Cloud9, set
			// host: options.host || '0.0.0.0';
			//
			// 0.0.0.0 is available to all network devices
			// unlink default `localhost`.
			host: process.env.HOST,
			port: 8000, // process.env.PORT,

			// can open both
			// http://localhost:8000/webpack-dev-server/
			// and
			// http://localhost:8000/

			// open: true,

			overlay: {
				errors: true,
				warnings: true
			},

			publicPath: '/',

			// Display only errors to reduce the amount of output.
			stats: 'errors-only',

			watchContentBase: true,
			watchOptions: {
				aggregateTimeout: 300
			}
		},
		// entry: [
		// 'webpack-dev-server/client?http://localhost:8000',
		// bundle the client for webpack-dev-server
		// and connect to the provided endpoint

		// 'webpack/hot/only-dev-server',
		// bundle the client for hot reloading
		// only- means to only hot reload for successful updates

		// the entry point of our app
		// './app/index.ts'
		// ],
		module: {
			rules: [
				{
					test: /\.ts$/,
					enforce: 'pre',
					exclude: ['node_modules'],
					loader: 'tslint-loader',
					options: {
						configFile: 'tslint.json',
						emitErrors: true,
						failOnHint: true
					}
				},
				{
					test: /\.js$/,
					// enforce: 'pre',
					loader: 'eslint-loader',
					options: {
						emitWarning: true
					}
				}
			]
		},
		plugins: [
			// new webpack.HotModuleReplacementPlugin(),
			// new webpack.NamedModulesPlugin(),
			new webpack.WatchIgnorePlugin([
				path.resolve(__dirname, 'node_modules')
			])
		]
	}
]);
