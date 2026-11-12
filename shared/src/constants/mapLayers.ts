import type {
  CircleLayerSpecification,
  ExpressionSpecification,
  FilterSpecification,
  SymbolLayerSpecification,
} from '@maplibre/maplibre-gl-style-spec'

import {
  circleRadiusLarge,
  circleRadiusSmall,
  clusterCountLayerId,
  clusterLayerId,
  featureLayerId,
  fontSizeLarge,
  fontSizeSmall,
  groupCount,
  MapFeature,
  mapMarker,
  multiPlaceBadgeColors,
  multiPlaceBadgeCountId,
  multiPlaceBadgeLayerId,
  multiPlaceBadgeOffset,
  multiPlaceBadgeRadius,
  textOffsetY,
} from './map.ts'

type MapLayer<T> = Omit<T, 'source'>
export type CircleMapLayer = MapLayer<CircleLayerSpecification>
export type SymbolMapLayer = MapLayer<SymbolLayerSpecification>

const textFont = ['Noto Sans Regular']

const firstPlaceId: ExpressionSpecification = ['get', 'id', ['at', 0, ['get', 'places']]]
const isSinglePlace: ExpressionSpecification = ['==', ['length', ['get', 'places']], 1]
const isSelected = (selectedFeature: MapFeature | null): ExpressionSpecification => [
  '==',
  firstPlaceId,
  selectedFeature?.properties.places[0]?.id ?? -1,
]

const multiPlaceFilter: FilterSpecification = [
  'all',
  ['!', ['has', 'point_count']],
  ['>', ['length', ['get', 'places']], 1],
]

export const clusterProperties: Record<string, ExpressionSpecification> = {
  sum: ['+', ['length', ['get', 'places']]],
}

export const clusterLayer = (color: string): CircleMapLayer => ({
  id: clusterLayerId,
  type: 'circle',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': color,
    'circle-radius': ['step', ['get', 'point_count'], circleRadiusSmall, groupCount, circleRadiusLarge],
  },
})

export const clusterCountLayer: SymbolMapLayer = {
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

export const markerLayer = (selectedFeature: MapFeature | null): SymbolMapLayer => {
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
        ['case', isActive, mapMarker.symbolActive, ['get', 'symbol', ['at', 0, ['get', 'places']]]],
        ['case', isActive, mapMarker.multiPlaceActive, mapMarker.multiPlace],
      ],
      'icon-offset': [
        'case',
        ['all', isSinglePlace, isActive],
        ['literal', [0, mapMarker.offsetY ?? 0]],
        ['literal', [0, 0]],
      ],
      'text-field': ['case', isSinglePlace, ['get', 'title', ['at', 0, ['get', 'places']]], ''],
      'text-font': textFont,
      'text-offset': [0, textOffsetY],
      'text-anchor': 'top',
      'text-size': fontSizeSmall,
      'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
    },
  }
}

export const multiPlaceBadgeLayer: CircleMapLayer = {
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

export const multiPlaceBadgeCountLayer = (selectedFeature: MapFeature | null): SymbolMapLayer => ({
  id: multiPlaceBadgeCountId,
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
