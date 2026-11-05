import { Theme } from '@mui/material/styles'
import { FilterSpecification } from 'maplibre-gl'
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
  multiPlaceBackgroundRadius,
  multiPlaceBadgeRadius,
  multiPlaceBadgeOffset,
  multiPlaceBackgroundLayerId,
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
export const markerLayer = (currentFeature: MapFeature | null): LayerProps => ({
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
      ['==', ['length', ['get', 'places']], 1],
      [
        'case',
        ['==', ['get', 'id', ['at', 0, ['get', 'places']]], currentFeature?.properties.places[0]?.id ?? -1],
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
        ['==', ['get', 'id', ['at', 0, ['get', 'places']]], currentFeature?.properties.places[0]?.id ?? -1],
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
  paint: {},
})

const multiPlaceFilter: FilterSpecification = [
  'all',
  ['!', ['has', 'point_count']],
  ['>', ['length', ['get', 'places']], 1],
]

export const multiPlaceBackgroundLayer = (theme: Theme): LayerProps => ({
  id: multiPlaceBackgroundLayerId,
  type: 'circle',
  source: 'point',
  filter: multiPlaceFilter,
  paint: {
    'circle-radius': multiPlaceBackgroundRadius,
    'circle-color': theme.palette.background.default,
    'circle-stroke-width': 1,
  },
})

export const multiPlaceBadgeLayer = (theme: Theme): LayerProps => ({
  id: multiPlaceBadgeLayerId,
  type: 'circle',
  source: 'point',
  filter: multiPlaceFilter,
  paint: {
    'circle-radius': multiPlaceBadgeRadius,
    'circle-color': theme.palette.text.secondary,
    'circle-stroke-width': 1,
    'circle-stroke-color': theme.palette.background.default,
    'circle-translate': multiPlaceBadgeOffset,
    'circle-translate-anchor': 'viewport',
  },
})

export const multiPlaceBadgeCountLayer = (theme: Theme): LayerProps => ({
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
    'text-color': theme.palette.background.default,
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
