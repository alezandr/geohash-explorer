// Copyright 2019 Alexander Berezovsky
// License: http://opensource.org/licenses/MIT

import * as L from 'leaflet'
import * as R from 'react'
import { Grid, GridTarget } from './grid-manager'
import { LatLngArea } from './types'
import { push, RouterAction, RouterState } from 'connected-react-router'
import { withRouter, RouteComponentProps } from 'react-router'

interface MapProps {
    geohash: string,
    onGeohashChanged?: (string) => void
    onGeohashSubmited?: (string) => void
}

class Map extends R.Component<RouteComponentProps<any> & MapProps> {

    private element: HTMLElement
    private map: L.Map
    private gridManager: Grid
    private propsState: any

    constructor(props, context) {
        super(props, context)
    }

    componentDidMount() {
        debug("Map.componentDidMount()")

        this.map = L.map('map', { doubleClickZoom: false, maxBounds: [[90, -180], [-90, 180]] }) // latlng
        this.map.setView(new L.LatLng(18, 0), 2)
        // this.map.setView(this.props.display.area)
        // let copyright = new L.TileLayer('http://localhost:9999/{z}/{x}/{y}.png', {
            let copyright = new L.TileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        })
        this.map.removeControl(this.map['attributionControl'])
        L.control.attribution({ position: 'bottomleft' }).addTo(this.map)
        this.map.addLayer(copyright)

        this.map.getBounds();
        // this.map.on('moveend', (evt: L.LeafletEvent) => {
        //     // TODO: remove?
        // })

        this.gridManager = new Grid(this.map, [[90, -180], [-90, 180]], (target) => {
            this.props.onGeohashSubmited(target.geohash)
        })

        this.updateView()
    }

    componentDidUpdate() {
        this.updateView()
    }

    private updateView() {
        const targetArea = this.gridManager.displayGrid(this.props.geohash.toLowerCase())
        if (this.props.history.location.state && this.props.history.location.state['submit']) {
            debug(`Map.updateView(): fitBounds(${JSON.stringify(targetArea)})`)

            if (this.props.geohash) {
                const [[startLat, startLng], [endLat, endLng]] = targetArea
                this.fitBounds({ start: { lat: startLat, lng: startLng }, end: { lat: endLat, lng: endLng } })
            } else {
                this.fitBounds({ start: { lat: 70, lng: -160 }, end: { lat: -60, lng: 160 } })
            }
        }
    }

    private fitBounds(area: LatLngArea) {
        const mapNorthWest = this.map.getBounds().getNorthWest()
        const mapSouthEast = this.map.getBounds().getSouthEast()

        const updateNorthWest = area.start.lat != mapNorthWest.lat || area.start.lng != mapNorthWest.lng
        const updateSouthEast = area.end.lat != mapSouthEast.lat || area.end.lng != mapSouthEast.lng

        if (updateNorthWest || updateSouthEast) {
            this.map.fitBounds([[area.start.lat, area.start.lng], [area.end.lat, area.end.lng]])
        }
    }

    render(): R.ReactNode {
        return R.createElement('div', { id: 'map', className: 'map', ref: (element) => { this.element = element } })
    }
}

export default withRouter(Map)