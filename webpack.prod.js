const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack'); //to access built-in plugins
var MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

// const merge = require('webpack-merge');

// module.exports = merge({}, {
//     mode: 'production',
// });

module.exports = {
    entry: './src/app.ts',
    output: {
        path: path.resolve(__dirname, 'build', 'dist'),
        filename: '[name]-[contenthash].js',
        // sourceMapFilename: '[file].map'
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.css'],
        modules: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules')
        ]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }, {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: { minimize: true }
                }]
            }, {
                test: /\.css$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader
                }, {
                    loader: 'css-loader'
                }]
            }, {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=.+)?$/,
                loader: 'file-loader?name=images/[name].[ext]'
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/assets/index.html",
            filename: "./index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "[name]-[hash].css",
            chunkFilename: "[id]-[hash].css"
        }),
        new CompressionPlugin({
            test: /\.js|\.css|\.html/i,
            algorithm: 'gzip',
            threshold: 1000,
        })
    ],
    optimization: {
        // minimizer: [{
        //     drop_console: true,
        // }]

        // moduleIds: 'size'
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    
                    compress: {
                        global_defs: {
                            DEBUG: false
                        }
                    },
                    output: {
                        beautify: false,
                    },
                }
            })
        ]
    }
}
