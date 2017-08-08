const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');

module.exports = merge([
	{
		devtool: 'source-map',
		devServer: {
			compress: true, //gzip
			contentBase: path.resolve(__dirname, 'app'), // for static files
			disableHostCheck: true, // bypass host checking
			historyApiFallback: {
				disableDotRule: true
			},
			host: process.env.HOST,
			hot: false, // for now
			inline: true, // alternative is iframe
			lazy: false,
			noInfo: false,
			open: false, //open web browser
			openPage: '',
			port: 8000, // process.env.PORT,
			overlay: {
				errors: true,
				warnings: true
			},
			publicPath: '/',
			quiet: false,
			stats: 'errors-only', // minimal, normal, detailed, verbose
			// sockjsPrefix: '/app',
			useLocalIp: false,
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
