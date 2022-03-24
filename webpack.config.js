const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack'); //to access built-in plugins
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackBar = require('webpackbar');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

module.exports = {
	mode: 'development',
	entry: {
        vendor : './vendor',
		framway: './src'
	},
	output: {
		filename: 'js/[name].js',
		path: path.resolve(__dirname, 'build'),
	},
    watchOptions: {
        // aggregateTimeout: 500,
        // ignored: /framway\.scss/
    },
	module: {
		rules: [
			{
                test: /\.js$/, // watch for js files
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                    	loader: 'babel-loader',  // transpile es6 javascript to es5
                    	options: {
                    		presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-proposal-logical-assignment-operators']
                    	}
                    }
                ],
            },
			{
                test: /\.s?css$/,  // will watch either for css or scss files
                // exclude: [path.resolve(__dirname, "scr/combined/export.scss") ],
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'fast-css-loader',
                    'postcss-loader',
                    'fast-sass-loader',
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                type: 'asset/resource',
                generator : {
                    filename : 'fonts/[name][ext][query]',
                }
            },
		]
	},
    resolve: {
        extensions: ['.js'],
        alias: {
            // 'utils': path.resolve(__dirname, './src/js/utils'),  // <-- When you build or restart dev-server, you'll get an error if the path to your utils.js file is incorrect.
        }
    },
	plugins: [
        new WebpackBar(),
        // new BundleAnalyzerPlugin(),
        new HtmlWebpackPlugin({
            title: 'Framway\'s home',
            template: './src/index.html',
            filename: './index.html',
            chunks: ['vendor', 'framway'],
            chunksSortMode: 'manual',
        }),
		new MiniCssExtractPlugin({filename : "css/[name].css"}),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery", // enable $ and jQuery as global variables
            // utils: 'utils',
        }),
        new LiveReloadPlugin(),
        new WebpackShellPluginNext({
            onWatchRun:{
                scripts: ['npm run framway onBuildStart'],
                blocking: true,
                parallel: false
            },
            onBeforeNormalRun:{
                scripts: ['npm run framway onBuildStart'],
                blocking: true,
                parallel: false
            },
            onBuildEnd:{
                scripts: ['npm run framway onBuildEnd'],
                blocking: false,
                parallel: true
            },
            dev: false,
        }),
	]
};