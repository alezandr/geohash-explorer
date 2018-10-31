export { }

declare global {
    export function debug(msg: string): void
    export const DEBUG
}

const _global = (window /* browser */ || global /* node */) as any
_global.DEBUG = typeof _global.DEBUG === 'undefined' ? true : _global.DEBUG
_global.debug = function (msg: string) {
    if (DEBUG) {
        console.log('DEBUG - ' + msg)
    }
}



/**
 * Webpack4 coniguration example: 
 * 
 *  optimization: {
 *      minimizer: [
 *          new UglifyJsPlugin({
 *               uglifyOptions: {
 *                   compress: { global_defs: { "@debug": "(function(msg) { console.log('DEBUG - ' + msg); })" }},
 *                   output: {beautify: true }
 *               }
 *          })
 *      ]
 *  }
 */