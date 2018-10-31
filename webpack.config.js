const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack'); //to access built-in plugins

module.exports = {
    entry: './src/app.ts',
    output: {
        path: path.resolve(__dirname, 'build', 'dist'),
        filename: '[name].boudle.js',
        sourceMapFilename: '[file].map'
    },

    devtool: 'inline-source-map',

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
            },{
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: { minimize: true }
                }]
            },{
                test: /\.css$/,
                use: [{
                    loader: 'style-loader'
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
        })
    ],

    devServer: {
        contentBase: path.resolve(__dirname, 'build', 'dist'),
        historyApiFallback: true,
        port: '9091'
    }
}
