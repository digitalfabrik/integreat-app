import type {
  CircleLayerSpecification,
  ExpressionSpecification,
  FilterSpecification,
  SymbolLayerSpecification,
} from '@maplibre/maplibre-gl-style-spec'

import { embedInCollection, MapFeature, MapFeatureCollection } from './map.ts'

type CircleMapLayer = Omit<CircleLayerSpecification, 'source'>
type SymbolMapLayer = Omit<SymbolLayerSpecification, 'source'>
type MapLayer = CircleMapLayer | SymbolMapLayer

type ClusterProperty = [ExpressionSpecification, ExpressionSpecification]

type MapSource = {
  id: string
  data: MapFeatureCollection
  cluster?: boolean
  clusterRadius?: number
  clusterProperties?: Record<string, ClusterProperty>
  layers: MapLayer[]
}

const placesSourceId = 'places'
const selectedFeatureSourceId = 'selected-feature'

export const featureLayerId = 'point'
export const clusterLayerId = 'clusteredPoints'
const selectedFeatureLayerId = 'selected-feature'
// Layers containing the place features which can be selected
export const placeLayerIds = [featureLayerId, selectedFeatureLayerId]
const clusterCountLayerId = 'cluster-count'
const multiPlaceBadgeLayerId = 'multi-place-badge-layer'
const multiPlaceBadgeCountLayerId = 'multi-place-badge-count'

const mapMarker = {
  iconSize: 0.6,
  symbolActive: 'marker_90_active',
  multiPlace: 'multipois_#585858',
  multiPlaceActive: 'multipois_active',
  activeOffsetY: -25,
}

const textFont = ['Noto Sans Regular']
const textOffsetY = 1.5
const fontSizeSmall = 12
const fontSizeLarge = 16
const groupCount = 50
const circleRadiusSmall = 20
const circleRadiusLarge = 30

const multiPlaceBackgroundRadius = 16
const multiPlaceBadgeRadius = 8
const multiPlaceBadgeOffset: [number, number] = [multiPlaceBadgeRadius, -multiPlaceBackgroundRadius]
const multiPlaceBadgeColors = {
  background: '#FFFFFF',
  text: '#585858',
  textActive: '#F03C1D',
}

const firstPlace: ExpressionSpecification = ['at', 0, ['get', 'places']]
const isSinglePlace: ExpressionSpecification = ['==', ['length', ['get', 'places']], 1]
const isSelected = (selectedFeature: MapFeature | null): ExpressionSpecification => [
  '==',
  ['get', 'id', firstPlace],
  selectedFeature?.properties.places[0]?.id ?? -1,
]

const multiPlaceFilter: FilterSpecification = [
  'all',
  ['!', ['has', 'point_count']],
  ['>', ['length', ['get', 'places']], 1],
]

const clusterRadius = 50
// Sums up the number of places of all features in a cluster, used by the cluster count layer
// The reduce expression must not be a plain operator like '+', as iOS treats it as a string literal
const clusterProperties: Record<string, ClusterProperty> = {
  sum: [
    ['+', ['accumulated'], ['get', 'sum']],
    ['length', ['get', 'places']],
  ],
}

const clusterLayer = (color: string): CircleMapLayer => ({
  id: clusterLayerId,
  type: 'circle',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': color,
    'circle-radius': ['step', ['get', 'point_count'], circleRadiusSmall, groupCount, circleRadiusLarge],
  },
})

const clusterCountLayer: SymbolMapLayer = {
  id: clusterCountLayerId,
  type: 'symbol',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': ['get', 'sum'],
    'text-font': textFont,
    'text-size': ['step', ['get', 'point_count'], fontSizeSmall, groupCount, fontSizeLarge],
    'text-allow-overlap': true,
  },
}

const markerLayer = (selectedFeature: MapFeature | null): SymbolMapLayer => {
  const isActive = isSelected(selectedFeature)
  return {
    id: featureLayerId,
    type: 'symbol',
    filter: ['!', ['has', 'point_count']],
    layout: {
      'symbol-placement': 'point',
      'symbol-z-order': 'source',
      'icon-allow-overlap': true,
      'text-allow-overlap': true,
      'icon-ignore-placement': true,
      'icon-size': mapMarker.iconSize,
      'icon-image': [
        'case',
        isSinglePlace,
        ['case', isActive, mapMarker.symbolActive, ['get', 'symbol', firstPlace]],
        ['case', isActive, mapMarker.multiPlaceActive, mapMarker.multiPlace],
      ],
      'icon-offset': [
        'case',
        ['all', isSinglePlace, isActive],
        ['literal', [0, mapMarker.activeOffsetY]],
        ['literal', [0, 0]],
      ],
      'text-field': ['case', isSinglePlace, ['get', 'title', firstPlace], ''],
      'text-font': textFont,
      'text-offset': [0, textOffsetY],
      'text-anchor': 'top',
      'text-size': fontSizeSmall,
      'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
    },
  }
}

const multiPlaceBadgeLayer: CircleMapLayer = {
  id: multiPlaceBadgeLayerId,
  type: 'circle',
  filter: multiPlaceFilter,
  paint: {
    'circle-radius': multiPlaceBadgeRadius,
    'circle-color': multiPlaceBadgeColors.background,
    'circle-translate': multiPlaceBadgeOffset,
    'circle-translate-anchor': 'viewport',
  },
}

const multiPlaceBadgeCountLayer = (selectedFeature: MapFeature | null): SymbolMapLayer => ({
  id: multiPlaceBadgeCountLayerId,
  type: 'symbol',
  filter: multiPlaceFilter,
  layout: {
    'text-field': ['to-string', ['length', ['get', 'places']]],
    'text-font': textFont,
    'text-size': fontSizeSmall,
    'text-allow-overlap': true,
    'text-ignore-placement': true,
  },
  paint: {
    'text-color': ['case', isSelected(selectedFeature), multiPlaceBadgeColors.textActive, multiPlaceBadgeColors.text],
    'text-translate': multiPlaceBadgeOffset,
    'text-translate-anchor': 'viewport',
  },
})

const placesLayers = (clusterColor: string, selectedFeature: MapFeature | null): MapLayer[] => [
  clusterLayer(clusterColor),
  clusterCountLayer,
  markerLayer(selectedFeature),
  multiPlaceBadgeLayer,
  multiPlaceBadgeCountLayer(selectedFeature),
]

const selectedFeatureLayers = (selectedFeature: MapFeature): MapLayer[] => [
  { ...markerLayer(selectedFeature), id: selectedFeatureLayerId },
  { ...multiPlaceBadgeLayer, id: `${selectedFeatureLayerId}-badge` },
  { ...multiPlaceBadgeCountLayer(selectedFeature), id: `${selectedFeatureLayerId}-badge-count` },
]

// The selected feature is rendered in a separate, non-clustered source to keep it visible if zoomed out
export const mapSources = (
  features: MapFeature[],
  selectedFeature: MapFeature | null,
  clusterColor: string,
): MapSource[] => [
  {
    id: placesSourceId,
    data: embedInCollection(features.filter(feature => feature !== selectedFeature)),
    cluster: true,
    clusterRadius,
    clusterProperties,
    layers: placesLayers(clusterColor, selectedFeature),
  },
  ...(selectedFeature
    ? [
        {
          id: selectedFeatureSourceId,
          data: embedInCollection([selectedFeature]),
          layers: selectedFeatureLayers(selectedFeature),
        },
      ]
    : []),
]
