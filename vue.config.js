const ExtractTextPlugin = require('terser-webpack-plugin');
// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin');

// 是否为开发环境（生产环境或测试环境）
const isProduction = process.env.NODE_ENV == 'production';
console.log(process.env.NODE_ENV);

// 多线程执行
let HappyPack = require('happypack');
let os = require('os');
let happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });


module.exports = {

	publicPath: '/',
	css: {
		loaderOptions: {
			// 全局css
			sass: {
				prependData: `@import "./src/assets/scss/_variable";`,
			},

		},
	},
	productionSourceMap: isProduction, //生产去除map

	configureWebpack: config => {

				// 生产环境相关配置
		console.log(isProduction);
		if (isProduction) {  
			// 代码压缩
			config.plugins.push(
				new ExtractTextPlugin({
					terserOptions: {
						//生产环境自动删除console
						compress: {
							// warnings: false, // 若打包错误，则注释这行
							drop_debugger: isProduction,
							drop_console: isProduction,
							pure_funcs: ['//console.log', 'console.log'],
							// pure_funcs: [],
						},
					},
					sourceMap: false,
					parallel: isProduction,
				}),
				
				// 多线程构建
				new HappyPack({
					id: 'babel',
					loaders: [
						{
							loader: 'babel-loader',
						},
					],
					threadPool: happyThreadPool,
				}),
				new HappyPack({
					id: 'css',
					// 如何处理 .css 文件，用法和 Loader 配置中一样
					loaders: ['css-loader'],
					// 使用共享进程池中的子进程去处理任务
					threadPool: happyThreadPool,
				})
			);

			// gzip压缩
			// gzip压缩  测试环境下
			// if (process.env.NODE_ENV === 'production'  process.env.VUE_APP_FLAG === 'test') {
			console.log('测试环境');
			const productionGzipExtensions = ['html', 'js', 'css'];
			config.plugins.push(
				new CompressionWebpackPlugin({
					filename: '[path].gz[query]',
					algorithm: 'gzip',
					test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
					threshold: 10240, // 只有大小大于该值的资源会被处理 10240
					minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
					deleteOriginalAssets: false, // 删除原文件
				})
			);
			// }
			// 	// 公共代码抽离
			config.optimization = {
				splitChunks: {
					cacheGroups: {
						vendor: {
							chunks: 'all',
							test: /node_modules/,
							name: 'vendor',
							minChunks: 1,
							maxInitialRequests: 5,
							minSize: 0,
							priority: 100,
						},
						common: {
							chunks: 'all',
							test: /[\\/]src[\\/]js[\\/]/,
							name: 'common',
							minChunks: 2,
							maxInitialRequests: 5,
							minSize: 0,
							priority: 60,
						},
						styles: {
							name: 'styles',
							test: /\.(sa|sc|c)ss$/,
							chunks: 'all',
							enforce: true,
						},
						runtimeChunk: {
							name: 'manifest',
						},
					},
				},
			};
		}
	},
};
