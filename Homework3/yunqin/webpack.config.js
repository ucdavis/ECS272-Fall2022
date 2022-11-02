const webpack = require('webpack')
const path = require("path");

const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')


module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        historyApiFallback: true,
        static: path.resolve(__dirname, './dist'),
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },
    entry: {
        main: path.resolve(__dirname, './src/index.ts'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            title: 'EVUE-Skeleton',
            template: path.resolve(__dirname, './src/template.html'), // template file
            filename: 'index.html', // output file
        }),
        // new ESLintPlugin({
        //     files: ['.', 'src', 'config'],
        //     formatter: 'table',
        // }),
        new webpack.DefinePlugin({ __VUE_OPTIONS_API__: true, __VUE_PROD_DEVTOOLS__: true }),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),

    ],
    module: {
        rules: [
            // JavaScript
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            //TypeScript
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            //Specify the specific TS compilation configuration to distinguish the TS configuration of the script
                            configFile: path.resolve(__dirname, './tsconfig.json'),
                            appendTsSuffixTo: [/\.vue$/],
                            transpileOnly:true
                        }
                    }
                ]
            },
            // Vue 2.0
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    esModule: true
                }
            },
            // Images
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource',
            },
            // Fonts and SVGs
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline',
            },
            // CSS, PostCSS, and Sass
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                loader: 'graphql-tag/loader',
            },
            {
                test: /\.(txt|csv|mmdb)$/,
                use:
                {
                    loader: 'file-loader',
                    options: {
                    name: "[path][name].[ext]",
                    emitFile: true,
                    },
                },
            }
        ],
    },
    resolve: {
        modules: [path.resolve(__dirname, '../src'), 'node_modules'],
        extensions: ['.js', '.jsx', '.json', '.ts'],
        alias: {
            '@': path.resolve(__dirname, '../src'),
            process: "process/browser"
        },
    },

};


