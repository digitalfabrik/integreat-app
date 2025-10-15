import { Feature, FeatureCollection, Point } from 'geojson'

type MapConfigProps = {
  styleJSON: string
  rtlPluginUrl: string
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

export type GeoJsonPoi = {
  id: number
  slug: string
  title: string
  symbol: string
}

export type GeoJsonPoiProperties = {
  pois: GeoJsonPoi[]
}

export type MarkerConfig = {
  defaultSymbol: string
  symbolActive: string
  multipoi: string
  iconSize: number
  offsetY?: number
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
  coordinates: LocationType | undefined
}
export type UnavailableLocationState = {
  status: 'unavailable'
  message: 'noPermission' | 'notAvailable' | 'timeout'
  coordinates: undefined
}

export type LocationStateType = SuccessfulLocationState | LoadingLocationState | UnavailableLocationState

// aliases for Features and FeatureCollections using custom GeoJsonProperties and Point
export type MapFeature = Feature<Point, GeoJsonPoiProperties> & {
  layer: {
    id: string
  }
}
export type MapFeatureCollection = FeatureCollection<Point, GeoJsonPoiProperties>
export const isMultipoi = (poiFeature: MapFeature): boolean => poiFeature.properties.pois.length > 1

export const mapConfig: MapConfigProps = {
  styleJSON: 'https://maps.tuerantuer.org/styles/integreat/style.json',
  rtlPluginUrl: '/plugins/mapbox-gl-rtl-text-0.2.3.min.js',
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

export const clusterClickZoomFactor = 2
export const normalDetailZoom = 15
export const closerDetailZoom = 18
export const maxMapZoom = 21
export const clusterRadius = 50
export const animationDuration = 2000

export const mapMarker: MarkerConfig = {
  iconSize: 0.6,
  defaultSymbol: 'marker_55',
  multipoi: 'multipois_#585858',
  symbolActive: 'marker_90_active',
  offsetY: -25,
}

export const openStreeMapCopyright: OpenStreetMapCopyrightType = {
  url: 'https://www.openstreetmap.org/copyright',
  icon: '©',
  linkText: 'OpenStreetMap',
  label: 'contributors',
}

// Shared layer ids
export const featureLayerId = 'point'
export const clusterLayerId = 'clusteredPoints'

// Shared layer properties
export const textOffsetY = 1.5
export const groupCount = 50
export const circleRadiusSmall = 20
export const circleRadiusLarge = 30
export const fontSizeSmall = 12
export const fontSizeLarge = 16

// The opening hours loaded from the cms are ordered according to the german weekday order
export const weekdays = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag', 'sonntag']
