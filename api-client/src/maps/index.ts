import { Feature, FeatureCollection, Point } from 'geojson'

type MapConfigProps = {
  styleJSON: string
  accessToken: string
}

export type MapViewViewport = {
  width: number
  height: number
  latitude: number
  longitude: number
  zoom: number
}

/**
 * Override existing GeoJsonProperties from types/geojson to be more precise
 */
export type GeoJsonPoiProperties = {
  id: number
  title: string
  path: string
  urlSlug: string
  symbol: string
  distance?: string
  thumbnail?: string
}

// aliases for Features and FeatureCollections using custom GeoJsonProperties and Point
export type PoiFeature = Feature<Point, GeoJsonPoiProperties>
export type PoiFeatureCollection = FeatureCollection<Point, GeoJsonPoiProperties>

export const mapConfig: MapConfigProps = {
  styleJSON: 'https://integreat.github.io/integreat-osm-liberty/style.json',
  accessToken: 'test'
}

export const defaultViewportConfig: MapViewViewport = {
  width: 400,
  height: 400,
  latitude: 48.366512,
  longitude: 10.894446,
  zoom: 8
}

export const detailZoom = 15
export const locationName = 'name'
