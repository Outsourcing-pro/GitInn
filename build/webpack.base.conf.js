var path = require('path')
var utils = require('./utils')
var config = require('../config')
var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin')

var vueLoaderConfig = require('./vue-loader.conf')

function resolve(dir) {
	return path.join(__dirname, '..', dir)
}

var envJs = '';
if (process.env.NODE_ENV === 'production') {
    envJs = './src/common/env/prod.js';
} else if (process.env.NODE_ENV === 'testing') {
    envJs = './src/common/env/test.js';
} else {
    envJs = './src/common/env/dev.js';
}
module.exports = {
	entry: {
		app: [envJs, './src/preConf.js','./src/main.js']
	},
	output: {
		path: config.build.assetsRoot,
		filename: '[name].js',
		publicPath: process.env.NODE_ENV === 'production' ?
			config.build.assetsPublicPath : config.dev.assetsPublicPath
	},
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'@': resolve('src'),
			'img': resolve('src/img')
		}
	},
	module: {
		rules: [{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: vueLoaderConfig
			},
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				include: [resolve('src'), resolve('test')]
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('media/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
				}
			}
		]
	},

	plugins: [
		new webpack.ProvidePlugin({
//			'$': 'jquery',
			'jQuery': 'jquery'
		}),
        new CopyWebpackPlugin([{
            from: resolve('/src/public/plugins'),
            to: resolve('/dist/plugins'),
        }])
	]

}