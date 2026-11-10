import { FilterSpecification, Layer } from '@maplibre/maplibre-react-native'
import { ComponentProps } from 'react'
import { DefaultTheme } from 'styled-components/native'

import {
  circleRadiusLarge,
  circleRadiusSmall,
  fontSizeLarge,
  fontSizeSmall,
  groupCount,
  mapMarker,
  MapFeature,
  featureLayerId,
  textOffsetY,
  clusterLayerId,
  multiPlaceBadgeRadius,
  multiPlaceBadgeOffset,
  multiPlaceBadgeLayerId,
  multiPlaceBadgeCountId,
} from 'shared'

type LayerProps = ComponentProps<typeof Layer>

export const clusterLayer = (theme: DefaultTheme): LayerProps => ({
  id: clusterLayerId,
  type: 'circle',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': ['step', ['get', 'point_count'], theme.colors.secondary, groupCount, theme.colors.secondary],
    'circle-radius': ['step', ['get', 'point_count'], circleRadiusSmall, groupCount, circleRadiusLarge],
  },
})

export const markerLayer = (selectedFeature: MapFeature | null): LayerProps => ({
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
      ['==', ['length', ['get', 'places']], 1],
      [
        'case',
        ['==', ['get', 'id', ['at', 0, ['get', 'places']]], selectedFeature?.properties.places[0]?.id ?? -1],
        mapMarker.symbolActive,
        ['get', 'symbol', ['at', 0, ['get', 'places']]],
      ],
      [
        'case',
        ['==', ['get', 'id', ['at', 0, ['get', 'places']]], selectedFeature?.properties.places[0]?.id ?? -1],
        mapMarker.multiPlaceActive,
        mapMarker.multiPlace,
      ],
    ],
    'icon-offset': [
      'case',
      [
        'all',
        ['==', ['length', ['get', 'places']], 1],
        ['==', ['get', 'id', ['at', 0, ['get', 'places']]], selectedFeature?.properties.places[0]?.id ?? -1],
      ],
      ['literal', [0, mapMarker.offsetY ?? 0]],
      ['literal', [0, 0]],
    ],
    'text-field': [
      'case',
      ['==', ['length', ['get', 'places']], 1],
      ['get', 'title', ['at', 0, ['get', 'places']]],
      '',
    ],
    'text-font': ['Noto Sans Regular'],
    'text-offset': [0, textOffsetY],
    'text-anchor': 'top',
    'text-size': fontSizeSmall,
    'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
  },
})

const multiPlaceFilter: FilterSpecification = [
  'all',
  ['!', ['has', 'point_count']],
  ['>', ['length', ['get', 'places']], 1],
]

export const multiPlaceBadgeLayer = (): LayerProps => ({
  id: multiPlaceBadgeLayerId,
  type: 'circle',
  filter: multiPlaceFilter,
  afterId: featureLayerId,
  paint: {
    'circle-radius': multiPlaceBadgeRadius,
    'circle-color': '#FFFFFF',
    'circle-translate': multiPlaceBadgeOffset,
    'circle-translate-anchor': 'viewport',
  },
})

export const multiPlaceBadgeCountLayer = (theme: DefaultTheme, selectedFeature: MapFeature | null): LayerProps => ({
  id: multiPlaceBadgeCountId,
  type: 'symbol',
  filter: multiPlaceFilter,
  afterId: multiPlaceBadgeLayerId,
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
      ['==', ['get', 'id', ['at', 0, ['get', 'places']]], selectedFeature?.properties.places[0]?.id ?? -1],
      '#F03C1D',
      '#585858',
    ],
    'text-translate': multiPlaceBadgeOffset,
    'text-translate-anchor': 'viewport',
  },
})

export const clusterCountLayer: LayerProps = {
  id: 'pointCount',
  type: 'symbol',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': ['get', 'sum'],
    'text-font': ['Noto Sans Regular'],
    'text-size': ['step', ['get', 'point_count'], fontSizeSmall, groupCount, fontSizeLarge],
    'text-allow-overlap': true,
  },
}
