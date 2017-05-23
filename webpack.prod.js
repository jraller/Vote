const webpack = require('webpack');
const merge = require('webpack-merge');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');

module.exports = merge([
	{
		plugins: [
			new CleanWebpackPlugin(
				['dist']
			),
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify('production')
				}
			}),
			new webpack.optimize.CommonsChunkPlugin(
				{
					filename: '[name].bundle.js',
					minChunks: Infinity,
					names: ['vendor']
				}
			),
			new webpack.optimize.UglifyJsPlugin({
				comments: true,
				mangle: false,
				compress: {
					warnings: true
				}
			}),
			new StatsPlugin(
				'stats.json', {
					chunkModules: true,
					exclude: [/node_modules/]
				}
			),
			new Visualizer()
		],
		resolve: {
			alias: {
				'vue$': 'vue/dist/vue.runtime.js'
			}
		}
	}
]);
