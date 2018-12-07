// Copyright 2019 Alexander Berezovsky
// License: http://opensource.org/licenses/MIT

import 'leaflet/dist/leaflet.css'
import './assets/default.css'

import * as R from 'react'
import * as ReactDOM from 'react-dom'
import { createBrowserHistory, History, Location, Action } from 'history'
import { Router, Route, RouteComponentProps } from 'react-router'

import ControlPanel from './control-panel'
import Map from './map'
import './globals'

class App extends R.Component<RouteComponentProps<any>> {

    constructor(props, context) {
        super(props, context)

        this.onGeohashChanged = this.onGeohashChanged.bind(this)
        this.onGeohashSubmited = this.onGeohashSubmited.bind(this)
    }

    onGeohashChanged(geohash: string) {
        debug(`InnerApp.onGeohashSubmited(geohash: '${geohash}')`)
        this.historyUpdate(geohash)
    }

    onGeohashSubmited(geohash: string) {
        debug(`InnerApp.onGeohashSubmited(geohash: '${geohash}')`)
        this.historySubmit(geohash)
    }

    private historyUpdate(geohash: string) {
        if (this.props.history.location.state && this.props.history.location.state['submit']) {
            this.props.history.push(geohash)
        } else {
            this.props.history.replace(geohash)
        }
    }
    private historySubmit(geohash: string) {
        this.props.history.replace(geohash, { submit: true })
    }

    render() {
        const geohash = this.props.location.pathname.substring(1) // remove leading '/'
        const pageUrl = this.props.location.state ? this.props.location.state['pageUrl'] : geohash

        const onGeohashChanged = this.onGeohashChanged
        const onGeohashSubmited = this.onGeohashSubmited

        return R.createElement('div', { className: 'root__container' },
            R.createElement('div', { className: 'root__map' },
                R.createElement(Map, { geohash, pageUrl, onGeohashSubmited })),
            R.createElement('div', { className: 'root__panel' },
                R.createElement('div', { className: 'panel' },
                    R.createElement('div', { className: 'panel__title' }, "GeoHash Explorer"),
                    R.createElement('div', { className: 'panel__geohash-search' },
                        R.createElement(ControlPanel, { geohash, pageUrl, onGeohashChanged, onGeohashSubmited })
                    )
                )
            )
        )
    }
}

const history: History = createBrowserHistory()
debug(`Init history L[${history.length}]: ${JSON.stringify(history)}`)

history.replace(history.location.pathname, { submit: true })
history.listen((location: Location<any>, action: Action) => {
    debug(`History: L('${history.length}') A('${action}')=>` + JSON.stringify(location))
})

ReactDOM.render(
    R.createElement(Router, { history }, R.createElement(Route, { component: App })),
    document.getElementById('root')
)