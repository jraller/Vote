const webpack = require('webpack');
const {resolve} = require('path');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');
const Visualizer = require('webpack-visualizer-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PATHS = {
	app: resolve(__dirname, 'app'),
	build: resolve (__dirname, 'dist')
};

// merge sect 4.2 of SurviveJS - Webpack -- refactor

const commonConfig = merge ([
	{
		entry: {
			// the entry point of our app
			app: PATHS.app,
			vendor: [
				'bootstrap-loader',
				'jquery'
			]
		},
		output: {
			path: PATHS.build,
			publicPath: '/dist',
			filename: '[name].js'
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader',
				},
				{
					test: /\.tsx?$/,
					loader: 'ts-loader',
					exclude: /node_modules/,
					options: {
						appendTsSuffixTo: [
							/\.vue$/
						]
					}
				},
				{
					test: /\.scss$/,
					loaders: ['style-loader', 'css-loader', 'postcss', 'sass']
				},
				{
					test: /\.(woff2?|ttf|eot|svg)$/, loader: 'url-loader?limit=10000'
				},
				{
					test: /bootstrap\/dist\/js\/umd\//,
					loader: 'imports?jQuery=jquery'
				}
			]
		},
		plugins: [
			new webpack.ProvidePlugin({
				jQuery: 'jquery',
				$: 'jquery',
				jquery: 'jquery'
			})
		],
		resolve: {
			// Add '.ts' and '.tsx' as a resolvable extension.
			alias: {
				'vue$': 'vue/dist/vue.esm.js'
			},
			extensions: ['.ts', '.tsx', '.js', '.vue']
		}
	},
	parts.lintJavaScript({include: PATHS.app}),
	parts.loadCSS()
]);

const productionConfig = merge([
	{
		plugins: [
			new CleanWebpackPlugin(
				['dist']
			),
			new webpack.optimize.CommonsChunkPlugin(
				{
					filename: '[name].bundle.js',
					minChunks: Infinity,
					names: ['vendor'],
				}
			),
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify('production')
				}
			}),
			// only for prod:
			new webpack.optimize.UglifyJsPlugin({
				comments: true,
				mangle: false,
				compress: {
					warnings: true
				}
			}),
			new Visualizer()
		]
	}
]);

const developmentConfig = merge([
	{
		devtool: 'source-map',
		devServer: {
			contentBase: resolve(__dirname, 'app'),
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
				resolve(__dirname, 'node_modules')
			])
		]
	}
]);

module.exports = (env) => {
	if (env === 'production') {
		return merge(commonConfig, productionConfig);
	}
	return merge(commonConfig, developmentConfig);
};
