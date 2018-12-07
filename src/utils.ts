// Copyright 2019 Alexander Berezovsky
// License: http://opensource.org/licenses/MIT

import { LatLngArea, LatLngPoint } from './types'

export const GEOHASH_EVEN_DICT = "bcfguvyz89destwx2367kmqr0145hjnp"
export const GEOHASH_ODD_DICT = "prxznqwyjmtvhksu57eg46df139c028b"

export type GeohashValidationStatus = { status: 'success' } | { status: 'error', index: number }

export function validateGeohash(geohash: string): GeohashValidationStatus {
    let index = 0;
    for (const char of geohash) {
        if (GEOHASH_EVEN_DICT.indexOf(char) < 0) {
            return {
                status: 'error',
                index
            }
        }
        index++
    }
    return {
        status: 'success'
    }
}

export function geohashToArea(geohash: string): LatLngArea {
    if (geohash.trim().length === 0) {
        return { start: { lat: 72, lng: -180 }, end: { lat: -72, lng: 180 } }
    }

    for (let i = 0,
        length = geohash.length, latSectionDeg = 180, lngSectionDeg = 360, latOffset = 90, lngOffset = -180;
        i < length; i++) {

        const odd = i % 2
        const geohashDict = odd ? GEOHASH_ODD_DICT : GEOHASH_EVEN_DICT

        const rowsNumber = odd ? 8 : 4
        const columnsNumber = odd ? 4 : 8

        latSectionDeg = latSectionDeg / rowsNumber
        lngSectionDeg = lngSectionDeg / columnsNumber

        const index = geohashDict.indexOf(geohash[i])
        if (index < 0) {
            throw `IllegalArgumentException: '${geohash[i]}' not belong to geohash`
        }
        const rowIndex = Math.floor(index / columnsNumber)
        const colIndex = index % columnsNumber

        latOffset -= rowIndex * latSectionDeg
        lngOffset += colIndex * lngSectionDeg

        if (length - 1 == i) {
            return {
                start: { lat: latOffset, lng: lngOffset, },
                end: { lat: latOffset - latSectionDeg, lng: lngOffset + lngSectionDeg, }
            }
        }
    }

    return null
}

export function getCenterPoint(area: LatLngArea): LatLngPoint {
    const maxMin = (val1, val2) => val1 > val2 ? { max: val1, min: val2 } : { max: val2, min: val1 }

    const latPoints = maxMin(area.start.lat, area.end.lat)
    const lngPoints = maxMin(area.start.lng, area.end.lng)

    const latDiff = latPoints.max - latPoints.min
    const lngDiff = lngPoints.max - lngPoints.min

    return {
        lat: latPoints.min + latDiff / 2,
        lng: lngPoints.min + lngDiff / 2
    }
}