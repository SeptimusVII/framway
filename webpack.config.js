const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack'); //to access built-in plugins
const fs = require('fs');
const framwayConfig = require('./framway.config.js');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const HtmlWebpackInlineStylePlugin = require('html-webpack-inline-style-plugin');

function generateHtmlPlugins (templateDir,targetPath = '') {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))
  const arrResults = [];
  templateFiles.forEach(function(item){
    const parts = item.split('.')
    const name = parts[0]
    const ext = parts[1]
    if(ext == 'html'){
        arrResults.push(
            new HtmlWebpackPlugin({
                filename: `${targetPath}${name}.${ext}`,
                template: `${templateDir}${name}.${ext}`,
                inject: false
            })
        );
    }
  });
  return arrResults;
}

var htmlEmails = generateHtmlPlugins('./src/emails/','emails/');
fs.readdirSync(path.resolve(__dirname, './src/themes/')).forEach(function(theme){
    if(framwayConfig.themes.indexOf(theme) != -1 && fs.existsSync('./src/themes/'+theme+'/emails/'))
        htmlEmails = htmlEmails.concat(generateHtmlPlugins('./src/themes/'+theme+'/emails/','emails/'))
})

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
                exclude: /(emails)/,
                // exclude: [path.resolve(__dirname, "scr/combined/export.scss") ],
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: {
                                mode: "icss",
                            },
                        },
                    },
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                    }
                    // 'fast-css-loader',
                    // 'fast-sass-loader',
                ]
            },
            {
                test: /\.html$/,  // will watch either for css or scss files
                include: /(emails)/,
                use: [
                    {loader: 'html-loader'},
                    {loader: 'interpolate-require-loader'},
                    {loader: 'extract-loader'},
                    {loader: 'raw-loader'},
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
		new MiniCssExtractPlugin({filename : "css/[name].css"}),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery", // enable $ and jQuery as global variables
            // utils: 'utils',
        }),
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
        new HtmlWebpackInlineStylePlugin(), // used to report styles in <style> to their respective tag's style attribute
	]
    .concat(htmlEmails)
};