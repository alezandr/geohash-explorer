// import { LatLngBoundsExpression } from 'leaflet'
// import { RouterState } from 'connected-react-router'

// export type LatLngSquareBounds = [[number, number], [number, number]]
// export type LatLng = [number, number]

export type LatLngPoint = { lat: number, lng: number }
export type LatLngArea = { start: LatLngPoint, end: LatLngPoint }

// export type GeoHashInputMode = { type: 'follow' } | { type: 'error', message: string }

// export interface GeohashStatusInvalidCharacter {
//     type: 'invalid_character'
//     index: number
// }

// export interface GeohashStatusOutOfView {
//     type: 'out_of_view'
// }

// export interface GeohashStatusOk {
//     type: 'ok'
// }

// export type GeohashStatus = GeohashStatusOk | GeohashStatusInvalidCharacter | GeohashStatusOutOfView