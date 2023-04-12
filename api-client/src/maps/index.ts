import { Feature, FeatureCollection, Point } from 'geojson'

type MapConfigProps = {
  styleJSON: string
  accessToken: string
}

export type MapViewViewport = {
  latitude: number
  longitude: number
  zoom: number
  maxZoom?: number
}

// type is used to calculate the initial boundingBox using height and width
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
  slug: string
  symbol: string
  category?: string
  address?: string
  distance?: string
  thumbnail?: string
  closeToOtherPoi: boolean
}

export type MarkerConfig = {
  defaultSymbol: string
  symbolActive: string
  iconSize: number
}

type OpenStreetMapCopyrightType = {
  label: string
  icon: string
  url: string
  linkText: string
}
// GeoLocation Types for useUserLocation hooks
export type LocationType = [number, number]
export type UserLocationType = SuccessfulLocationState | UnavailableLocationState

export type SuccessfulLocationState = {
  status: 'ready'
  message: 'ready'
  coordinates: LocationType
}
export type LoadingLocationState = {
  status: 'loading'
  message: 'loading'
  coordinates: LocationType | null
}
export type UnavailableLocationState = {
  status: 'unavailable'
  message: 'noPermission' | 'notAvailable' | 'timeout'
  coordinates: null
}

export type LocationStateType = SuccessfulLocationState | LoadingLocationState | UnavailableLocationState

// aliases for Features and FeatureCollections using custom GeoJsonProperties and Point
export type PoiFeature = Feature<Point, GeoJsonPoiProperties>
export type PoiFeatureCollection = FeatureCollection<Point, GeoJsonPoiProperties>

export const mapConfig: MapConfigProps = {
  styleJSON: 'https://maps.tuerantuer.org/styles/integreat/style.json',
  accessToken: 'dummy',
}

export const defaultViewportConfig: MapViewViewport = {
  latitude: 48.366512,
  longitude: 10.894446,
  zoom: 8,
}

export const defaultMercatorViewportConfig: MapViewMercatorViewport = {
  width: 400,
  height: 400,
  ...defaultViewportConfig,
}

export const normalDetailZoom = 15
export const closerDetailZoom = 18
export const maxMapZoom = 21
export const clusterRadius = 50
export const animationDuration = 2000

export const mapMarker: MarkerConfig = {
  iconSize: 0.6,
  defaultSymbol: 'marker_55',
  symbolActive: 'marker_90_active',
}

export const openStreeMapCopyright: OpenStreetMapCopyrightType = {
  url: 'https://www.openstreetmap.org/copyright',
  icon: '©',
  linkText: 'OpenStreetMap',
  label: 'contributors',
}

// Shared layer properties
export const textOffsetY = 1.5
export const groupCount = 50
export const circleRadiusSmall = 20
export const circleRadiusLarge = 30
export const fontSizeSmall = 12
export const fontSizeLarge = 16
