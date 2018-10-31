import * as L from 'leaflet'

interface Cell {
    midX: number
    midY: number
    width: number
    height: number
}

export let ExtendSVG = L.SVG.extend({
    initialize(options) {
        L.Renderer.prototype['initialize'].call(this, options);
    },

    _initPath: function (layer) {
        L.SVG.prototype['_initPath'].call(this, layer);
        var label = layer._label = L.SVG.create('text');
        label.innerHTML = layer['_text'] ? layer['_text'] : 'W'
    },

    _addPath: function (layer) {
        L.SVG.prototype['_addPath'].call(this, layer);
        this._rootGroup.appendChild(layer._label);
    },

    _removePath: function (layer) {
        L.SVG.prototype['_removePath'].call(this, layer);
        L.DomUtil.remove(layer._label);
    },

    _setStyle(layer: L.Layer & { _label }, style: { x: number, y: number, fontSize: number, opacity: number }) {
        let label = layer._label
        label.setAttribute('class', "geohash-cell-label")
        label.setAttribute('visibility', 'visible')
        // label.attribu

        label.setAttribute('x', style.x)
        label.setAttribute('y', style.y)

        label.setAttribute('text-anchor', 'middle')
        label.setAttribute('dominant-baseline', 'middle')
        label.setAttribute('font-size', style.fontSize)
        label.setAttribute('fill-opacity', style.opacity)

    },

    _updateLabel: function (layer: L.Layer & { _parts, _label }) {
        if (layer._parts.length > 0) {
            let label = layer._label

            const cell: Cell = this._calcCell(layer._parts)
            debug(`ExtendLeaflet._updateLabel() cell - '${label.innerHTML}', 
                    size: '${JSON.stringify(cell)}, parts: ${JSON.stringify(layer._parts)}`)
            if (cell.width > 300) {
                label.setAttribute('visibility', 'visible')

                label.setAttribute('x', cell.midX)
                label.setAttribute('y', cell.midY)

                label.setAttribute('text-anchor', 'middle')
                label.setAttribute('dominant-baseline', 'middle')
                label.setAttribute('font-size', 150)
                label.setAttribute('fill-opacity', "0.3")
                label.setAttribute('class', "geohash-cell-label")

            } else if (cell.width > 80) {
                label.setAttribute('visibility', 'visible')

                label.setAttribute('x', cell.midX)
                label.setAttribute('y', cell.midY)

                label.setAttribute('text-anchor', 'middle')
                label.setAttribute('dominant-baseline', 'middle')
                label.setAttribute('font-size', 50)
                label.setAttribute('fill-opacity', "0.6")
                label.setAttribute('class', "geohash-cell-label")

            } else if (cell.width > 24) {
                label.setAttribute('visibility', 'visible')

                label.setAttribute('x', cell.midX)
                label.setAttribute('y', cell.midY)

                label.setAttribute('text-anchor', 'middle')
                label.setAttribute('dominant-baseline', 'middle')
                label.setAttribute('font-size', 16)
                label.setAttribute('fill-opacity', "1.0")
                label.setAttribute('class', "geohash-cell-label")

            } else {
                label.setAttribute('visibility', 'hidden')
            }
        } else {
            layer._label.setAttribute('visibility', 'hidden')
        }
    },

    _updatePoly: function (layer: L.Layer & { _parts, _label }, closed) {
        this._setPath(layer, L.SVG.pointsToPath(layer._parts, closed));
        this._updateLabel(layer)
    },

    _calcCell(_rings): Cell {
        var i, j, p1, p2, f, area, x, y,
            points = _rings[0],
            len = points.length;

        if (!len) { return null; }

        // polygon centroid algorithm; only uses the first ring if there are multiple
        area = x = y = 0;

        var minX, minY, maxX, maxY = 0

        for (i = 0, j = len - 1; i < len; j = i++) {
            if (i == 0) {
                minX = maxX = points[i].x
                minY = maxY = points[i].y
            } else {
                if (points[i].x > maxX) {
                    maxX = points[i].x
                }
                if (points[i].y > maxY) {
                    maxY = points[i].y
                }
                if (points[i].x < minX) {
                    minX = points[i].x
                }
                if (points[i].y < minY) {
                    minY = points[i].y
                }
            }

            p1 = points[i];
            p2 = points[j];

            f = p1.y * p2.x - p2.y * p1.x;
            x += (p1.x + p2.x) * f;
            y += (p1.y + p2.y) * f;
            area += f * 3;
        }

        let midX, midY, width, height
        if (area === 0) {
            // Polygon is so small that all points are on same pixel. 
            midX = minY = points[0];
            width = height = 0
        } else {
            midX = x / area
            midY = y / area
            width = maxX - minX
            height = maxY - minY
        }
        return {
            midX, midY, width, height
        }
    }

    // _onZoom() {
    //     console.log("DEBUG: ExtendSVG._onZoom()")
    //     L.Renderer.prototype['_onZoom'].call(this)
    // },

    // _onZoomStart() {
    //     // console.log("DEBUG: ExtendSVG._onZoomStart()")
    //     L.SVG.prototype['_onZoomStart'].call(this)
    // },

    // _onZoomEnd() {
    //     // console.log("DEBUG: ExtendSVG._onZoom()")
    //     L.SVG.prototype['_onZoomEnd'].call(this)
    // }
})
