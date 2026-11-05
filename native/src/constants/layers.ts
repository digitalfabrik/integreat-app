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
  multiPlaceBackgroundLayerId,
  multiPlaceBackgroundRadius,
  multiPlaceBadgeRadius,
  multiPlaceBadgeOffset,
  multiPlaceBadgeLayerId,
  multiPlaceBadgeCountId,
} from 'shared'

type LayerProps = ComponentProps<typeof Layer>

export const clusterLayer = (theme: DefaultTheme): LayerProps => ({
  id: clusterLayerId,
  type: 'circle',
  paint: {
    'circle-color': ['case', ['has', 'point_count'], theme.colors.secondary, 'transparent'],
    'circle-radius': ['step', ['get', 'point_count'], circleRadiusSmall, groupCount, circleRadiusLarge],
  },
})

export const markerLayer = (selectedFeature: MapFeature | null): LayerProps => ({
  id: featureLayerId,
  type: 'symbol',
  layout: {
    'symbol-placement': 'point',
    'symbol-z-order': 'source',
    'icon-allow-overlap': true,
    'text-allow-overlap': true,
    'icon-size': mapMarker.iconSize,
    'icon-ignore-placement': true,
    'icon-image': [
      'case',
      ['==', ['length', ['get', 'places']], 1],
      [
        'case',
        ['==', ['get', 'id', ['at', 0, ['get', 'places']]], selectedFeature?.properties.places[0]?.id ?? -1],
        mapMarker.symbolActive,
        ['get', 'symbol', ['at', 0, ['get', 'places']]],
      ],
      mapMarker.multiPlace,
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

export const multiPlaceBackgroundLayer = (theme: DefaultTheme): LayerProps => ({
  id: multiPlaceBackgroundLayerId,
  type: 'circle',
  filter: multiPlaceFilter,
  beforeId: featureLayerId,
  paint: {
    'circle-radius': multiPlaceBackgroundRadius,
    'circle-color': theme.colors.background,
    'circle-stroke-width': 1,
  },
})

export const multiPlaceBadgeLayer = (theme: DefaultTheme): LayerProps => ({
  id: multiPlaceBadgeLayerId,
  type: 'circle',
  filter: multiPlaceFilter,
  afterId: featureLayerId,
  paint: {
    'circle-radius': multiPlaceBadgeRadius,
    'circle-color': theme.colors.outlineVariant,
    'circle-stroke-width': 1,
    'circle-stroke-color': theme.colors.background,
    'circle-translate': multiPlaceBadgeOffset,
    'circle-translate-anchor': 'viewport',
  },
})

export const multiPlaceBadgeCountLayer = (theme: DefaultTheme): LayerProps => ({
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
    'text-color': theme.colors.background,
    'text-translate': multiPlaceBadgeOffset,
    'text-translate-anchor': 'viewport',
  },
})

export const clusterCountLayer: LayerProps = {
  id: 'pointCount',
  type: 'symbol',
  layout: {
    'text-field': ['get', 'point_count_abbreviated'],
    'text-font': ['Noto Sans Regular'],
    'text-size': ['step', ['get', 'point_count'], fontSizeSmall, groupCount, fontSizeLarge],
    'text-allow-overlap': true,
  },
}
