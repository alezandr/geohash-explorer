// Copyright 2019 Alexander Berezovsky
// License: http://opensource.org/licenses/MIT

export { }
declare global {
    export function debug(msg: string): void
    export const DEBUG
}

const _global = (window /* browser */) as any
_global.DEBUG = typeof _global.DEBUG === 'undefined' ? true : _global.DEBUG
_global.debug = function (msg: string) {
    if (_global.DEBUG) {
        console.log('DEBUG - ' + msg)
    }
}