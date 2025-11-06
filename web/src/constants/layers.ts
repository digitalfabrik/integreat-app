import { Theme } from '@mui/material/styles'
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
  layout: {
    'icon-allow-overlap': true,
    'text-allow-overlap': true,
    'icon-ignore-placement': true,
    'icon-size': mapMarker.iconSize,
    'icon-image': [
      'case',
      ['==', ['get', 'id', ['at', 0, ['get', 'pois']]], currentFeature?.properties.pois[0]?.id ?? -1],
      mapMarker.symbolActive,
      [
        'case',
        ['==', ['length', ['get', 'pois']], 1],
        ['get', 'symbol', ['at', 0, ['get', 'pois']]],
        mapMarker.multipoi,
      ],
    ],
    'icon-offset': [
      'case',
      ['==', ['get', 'id', ['at', 0, ['get', 'pois']]], currentFeature?.properties.pois[0]?.id ?? -1],
      ['literal', [0, mapMarker.offsetY ?? 0]],
      ['literal', [0, 0]],
    ],
    'text-field': ['case', ['==', ['length', ['get', 'pois']], 1], ['get', 'title', ['at', 0, ['get', 'pois']]], ''],
    'text-font': ['Noto Sans Regular'],
    'text-offset': [0, textOffsetY],
    'text-anchor': 'top',
    'text-size': fontSizeSmall,
    'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
  },
  paint: {},
})

export const clusterProperties: { [key: string]: unknown } = {
  sum: ['+', ['length', ['get', 'pois']]],
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
