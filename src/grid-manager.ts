import * as L from 'leaflet'
import { ExtendSVG } from './extended-leaflet'

export interface GridTarget {
    area: L.LatLngBoundsLiteral
    geohash: string
}

export class Grid {
    private static readonly GEOHASH_EVEN_DICT: string = "bcfguvyz89destwx2367kmqr0145hjnp"
    private static readonly GEOHASH_ODD_DICT: string = "prxznqwyjmtvhksu57eg46df139c028b"
    private static readonly renderer = new ExtendSVG()

    private map: L.Map

    private area: L.LatLngBoundsLiteral
    private rectangle: L.Rectangle

    private children: {} = {}

    private listener: (target: GridTarget) => void

    constructor(map: L.Map, area: L.LatLngBoundsLiteral, listener: (target: GridTarget) => void = null) {
        this.map = map
        this.area = area
        this.listener = listener
    }

    displayFlat(geohash: string, label: string) {
        if (Object.keys(this.children).length > 0) {
            this.remove()
        }
        if (!this.rectangle) {
            this.rectangle = L.rectangle(this.area, { renderer: Grid.renderer })
            this.rectangle['_text'] = label
            if (this.listener) {
                this.rectangle.addEventListener('click', (e) => {
                    this.listener({ area: this.area, geohash })
                })
            }

            const style = {
                fillOpacity: 0.0,
                weight: 1
            }
            this.rectangle.setStyle(style as L.PathOptions);
            this.map.addLayer(this.rectangle)
        }
    }

    displayGrid(geohash: string = "", offset: number = 0): L.LatLngBoundsLiteral {
        
        if (this.rectangle) {
            debug(` Grid.displayGrid(geohash=${geohash}, offset=${offset}) do remove rectangle`)
            this.remove()
        }

        let targetArea = this.appendGrid(this.area, geohash, offset)

        if (Grid.GEOHASH_ODD_DICT.indexOf(geohash.charAt(offset)) === -1) {
            this.rectangle = L.rectangle(this.area)
            this.rectangle.setStyle({
                // className: 'geohash-cell-error',
                className: 'disable-pointer-events',
                color: '#dc3545',
                fillOpacity: 0.3,
                weight: 4
            })
            this.map.addLayer(this.rectangle)
            targetArea = this.area
        } else if (offset !== 0 && geohash.length == offset) {
            this.rectangle = L.rectangle(this.area)
            this.rectangle.setStyle({
                className: 'disable-pointer-events',
                fillOpacity: 0.0,
                weight: 4
            })
            this.map.addLayer(this.rectangle)
            targetArea = this.area
        }

        return targetArea
    }

    private appendGrid(rect: L.LatLngBoundsLiteral, geohash: string, offset: number): L.LatLngBoundsLiteral {
        const [[startLat, startLng], [endLat, endLng]] = rect

        if (startLng < -180 || startLng > 180 || endLng < - 180 || endLng > 180) {
            throw "Longitude out of range, expected [-180 <= x <= 180], actual: " + startLng + "-" + endLng
        }
        if (startLat < -90 || startLat > 90 || endLat < -90 || endLat > 90) {
            throw "Latitude out of range, expected [-90 <= x <= 90], actual: " + startLat + "-" + endLat
        }

        const odd = offset % 2

        const rowsNumber = odd ? 8 : 4
        const columnsNumber = odd ? 4 : 8

        const geohashDict = odd ? Grid.GEOHASH_ODD_DICT : Grid.GEOHASH_EVEN_DICT

        const lngStep = (startLng * -1 + endLng) / columnsNumber
        const latStep = (startLat * -1 + endLat) / rowsNumber

        let targetArea = rect

        for (let y = 0; y < rowsNumber; y++) {
            const rectLatStart = y * latStep + startLat
            const rectLatEnd = (y + 1) * latStep + startLat


            for (let x = 0; x < columnsNumber; x++) {
                const rectLngStart = x * lngStep + startLng
                const rectLngEnd = (x + 1) * lngStep + startLng
                const area: L.LatLngBoundsLiteral = [[rectLatStart, rectLngStart], [rectLatEnd, rectLngEnd]]
                const latter = geohashDict.charAt(columnsNumber * y + x)

                let subitem = this.children[latter] ? this.children[latter] : new Grid(this.map, area, this.listener)
                this.children[latter] = subitem
                if (latter == geohash[offset]) {
                    targetArea = subitem.displayGrid(geohash, offset + 1)
                } else {
                    subitem.displayFlat(geohash.substr(0, offset) + latter, latter)
                }
            }
        }

        return targetArea
    }

    remove() {
        this.rectangle && this.rectangle.remove()
        this.rectangle = null
        for (const key of Object.keys(this.children)) {
            this.children[key].remove()
        }
        this.children = {}
    }
}