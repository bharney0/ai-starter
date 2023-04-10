import { DefinePlugin, Configuration, HotModuleReplacementPlugin, LoaderOptionsPlugin, NormalModuleReplacementPlugin, ProvidePlugin, SourceMapDevToolPlugin } from "webpack";
import "webpack-dev-server";
import { join, resolve } from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { merge } from "webpack-merge";
import CopyWebpackPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import autoprefixer from 'autoprefixer';
// import {BundleAnalyzerPlugin} from "webpack-bundle-analyzer";
import HtmlWebpackPlugin from 'html-webpack-plugin';
const LoadablePlugin = require('@loadable/webpack-plugin')
interface Env {
    production: boolean;
    hot: boolean;
}

function createBaseConfig(env: Env): Configuration {
    return {

        mode: env.production ? "production" : "development",

        devtool: env.production ? false : "source-map",

        resolve: {
            extensions: [".ts", ".tsx", ".js"],
        },

        plugins: [

            new DefinePlugin({
                __PRODUCTION__: JSON.stringify(env.production),
            })
        ]
    }
} // end base config

function createServerConfig(env: Env): Configuration {
    return {
        name: "server",
        target: "node",
        context: resolve(__dirname, "src/server"),
        externalsPresets: {
            node: true
        },
        ignoreWarnings: [
            {
                /* 
                * Express compilation issue:
                * WARNING in ../node_modules/express/lib/view.js 81:13-25 Critical dependency: the request of a dependency is an expression
                * more at: https://github.com/webpack/webpack/issues/1576
                */
                module: /express/,
                message: /Critical\sdependency:\sthe\srequest\sof\sa\sdependency\sis\san\sexpression/,
            }
        ],
        entry: "./app.ts",
        output: {
            path: resolve(__dirname, "dist"),
            filename: "app.js",
            publicPath: "./" // file-loader prepends publicPath to the emited url. without this, react will complain about server and client mismatch
        },
        module: {
            rules: [
                { test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules/ },
                {
                    // file-loader config must match client's (except 'emitFile' property)
                    test: /\.(jpg|png|gif|svg)$/, 
                    use: { 
                        loader: "file-loader", 
                        options: {
                            outputPath: "images",
                            name: "[name].[contenthash].[ext]",
                            emitFile: false 
                        }}
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ["!public/**"]
            }),
            new DefinePlugin({
                __Server__: JSON.stringify(true)
            }),
        ]

    }
} // end server configuration

function createClientConfig(env: Env): Configuration {
    const babelConfig = {
        presets: [
            "@babel/preset-env",
            "@babel/preset-react",
            "@babel/preset-typescript",
        ],
        plugins: [
            "@babel/plugin-transform-runtime",
            env.hot && require.resolve("react-refresh/babel")
        ].filter(Boolean)
    }
    return {
        name: "client",
        target: "web",
        context: resolve(__dirname, "src/client"),
        optimization: {
            splitChunks: {
                chunks: "all"
            }
        },
        entry: {
            index: "./Index.tsx"
        },
        output: {
            path: resolve(__dirname, "dist", "public"),
            filename: env.production ? "js/[name].[chunkhash].js" : "js/[name].js",
        },
        module: {
            rules: [
                {                     
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: { loader: "babel-loader", options: babelConfig },
                },
                {
                    test: /\.(jpg|png|gif|svg)$/, 
                    use: { 
                        loader: "file-loader", 
                        options: {
                            outputPath: "images",
                            name: "[name].[contenthash].[ext]"
                        }}
                },
                {
                    test: /\.(css|scss)(\?|$)/, 
                    use: ['style-loader', 'css-loader', 'sass-loader']
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: "./index.html"
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {from: "resources/favicon.ico"}
                ]
            }),
            new ProvidePlugin({ $: 'jquery', jQuery: 'jquery', JQuery: 'jquery', Popper: ['popper.js', 'default'] }),
            new NormalModuleReplacementPlugin(/\/iconv-loader$/, require.resolve('node-noop')), // Workaround for https://github.com/andris9/encoding/issues/16
            new DefinePlugin({
                __SERVER__: JSON.stringify(false),
            }),
            new LoadablePlugin(),
            (env.hot && new ReactRefreshPlugin()) as any // casting so tsc will stop complaining
        ].filter(Boolean),
        devServer: {
            hot: env.hot,
            port: 9000,
            historyApiFallback: true
        }
    };

} // end client configuration

// Configuration in common to both client-side and server-side bundles
function createSharedConfig (env: Env): Configuration {
    const isDevBuild = !(env && env.production);
    return {
        mode: isDevBuild ? 'development' : 'production',
        stats: { modules: false },
        resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        output: {
            filename: '[name].js',
            chunkFilename: "[name].js",
            publicPath: '/dist/', // Webpack dev middleware, if enabled, handles requests for this URL prefix
        },
        module: {
            rules: [
                { test: /\.(jpg|jpeg|png|gif|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' }
            ]
        }
    }
};

export default function (e: any) {

    const env: Env = {
        hot: !!e["HOT"],
        production: !!e["PRODUCTION"]
    }

    const baseConfig = createBaseConfig(env);
    const sharedConfig = merge(baseConfig, createSharedConfig(env));
    const clientConfig = merge(sharedConfig, createClientConfig(env));
    const serverConfig = merge(sharedConfig, createServerConfig(env));

    return [clientConfig, serverConfig];
};