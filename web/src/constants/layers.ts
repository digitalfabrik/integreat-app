import { Theme } from '@mui/material/styles'
import { ExpressionSpecification, FilterSpecification } from 'maplibre-gl'
import { LayerProps } from 'react-map-gl/maplibre'

import {
  circleRadiusLarge,
  circleRadiusSmall,
  fontSizeLarge,
  fontSizeSmall,
  groupCount,
  mapMarker,
  MapFeature,
  textOffsetY,
  clusterLayerId,
  featureLayerId,
  multiPlaceBadgeRadius,
  multiPlaceBadgeOffset,
  multiPlaceBadgeLayerId,
  multiPlaceBadgeCountId,
} from 'shared'

export const clusterLayer = (theme: Theme): LayerProps => ({
  id: clusterLayerId,
  type: 'circle',
  source: 'point',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': [
      'step',
      ['get', 'point_count'],
      theme.palette.secondary.main,
      groupCount,
      theme.palette.secondary.main,
    ],
    'circle-radius': ['step', ['get', 'point_count'], circleRadiusSmall, groupCount, circleRadiusLarge],
  },
})

export const markerLayer = (currentFeature: MapFeature | null): LayerProps => {
  const firstPlaceId: ExpressionSpecification = ['get', 'id', ['at', 0, ['get', 'places']]]
  const isSinglePlace: ExpressionSpecification = ['==', ['length', ['get', 'places']], 1]
  const isActive: ExpressionSpecification = ['==', firstPlaceId, currentFeature?.properties.places[0]?.id ?? -1]

  return {
    id: featureLayerId,
    type: 'symbol',
    source: 'point',
    filter: ['!', ['has', 'point_count']],
    layout: {
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
      'text-font': ['Noto Sans Regular'],
      'text-offset': [0, textOffsetY],
      'text-anchor': 'top',
      'text-size': fontSizeSmall,
      'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
    },
    paint: {},
  }
}

const multiPlaceFilter: FilterSpecification = [
  'all',
  ['!', ['has', 'point_count']],
  ['>', ['length', ['get', 'places']], 1],
]

export const multiPlaceBadgeLayer = (theme: Theme): LayerProps => ({
  id: multiPlaceBadgeLayerId,
  type: 'circle',
  source: 'point',
  filter: multiPlaceFilter,
  paint: {
    'circle-radius': multiPlaceBadgeRadius,
    'circle-color': theme.palette.common.white,
    'circle-translate': multiPlaceBadgeOffset,
    'circle-translate-anchor': 'viewport',
  },
})

export const multiPlaceBadgeCountLayer = (theme: Theme, currentFeature: MapFeature | null): LayerProps => ({
  id: multiPlaceBadgeCountId,
  type: 'symbol',
  source: 'point',
  filter: multiPlaceFilter,
  layout: {
    'text-field': ['to-string', ['length', ['get', 'places']]],
    'text-font': ['Noto Sans Regular'],
    'text-size': fontSizeSmall,
    'text-allow-overlap': true,
    'text-ignore-placement': true,
  },
  paint: {
    'text-color': [
      'case',
      ['==', ['get', 'id', ['at', 0, ['get', 'places']]], currentFeature?.properties.places[0]?.id ?? -1],
      '#F03C1D',
      '#585858',
    ],
    'text-translate': multiPlaceBadgeOffset,
    'text-translate-anchor': 'viewport',
  },
})

export const clusterProperties: { [key: string]: unknown } = {
  sum: ['+', ['length', ['get', 'places']]],
}

export const clusterCountLayer: LayerProps = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'point',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': ['get', 'sum'],
    'text-font': ['Noto Sans Regular'],
    'text-size': ['step', ['get', 'point_count'], fontSizeSmall, groupCount, fontSizeLarge],
    'text-allow-overlap': true,
  },
}
