import { Feature, FeatureCollection, Point } from 'geojson'

type MapConfigProps = {
  styleJSON: string
  accessToken: string
}

export type MapViewViewport = {
  latitude: number
  longitude: number
  zoom: number
}

// tpye is used to calculate the initial boundingBox using height and width
export type MapViewMercatorViewport = MapViewViewport & {
  height: number
  width: number
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
  address?: string
  distance?: string
  thumbnail?: string
}

export type MarkerConfig = {
  symbol: string
  symbolActive: string
  iconSize: number
}
// GeoLocation Types for useUserLocation hooks
export type LocationType = [number, number]
export type UserLocationType = {
  locationState: LocationStateType
  userCoordinates: LocationType | null
}

export type SuccessfulLocationState = {
  status: 'ready'
  message: 'localized'
}
export type UnavailableLocationState = {
  status: 'unavailable'
  message: 'noPermission' | 'notAvailable' | 'timeout' | 'loading'
}

export type LocationStateType = SuccessfulLocationState | UnavailableLocationState

// aliases for Features and FeatureCollections using custom GeoJsonProperties and Point
export type PoiFeature = Feature<Point, GeoJsonPoiProperties>
export type PoiFeatureCollection = FeatureCollection<Point, GeoJsonPoiProperties>

export const mapConfig: MapConfigProps = {
  styleJSON: 'https://maps.tuerantuer.org/styles/integreat/style.json',
  accessToken: 'dummy'
}

export const defaultViewportConfig: MapViewViewport = {
  latitude: 48.366512,
  longitude: 10.894446,
  zoom: 8
}

export const defaultMercatorViewportConfig: MapViewMercatorViewport = {
  width: 400,
  height: 400,
  latitude: 48.366512,
  longitude: 10.894446,
  zoom: 8
}

export const detailZoom = 15
export const locationName = 'name'

export const mapMarker: MarkerConfig = {
  iconSize: 1.75,
  symbol: 'marker_15',
  symbolActive: 'marker_15_active'
}
