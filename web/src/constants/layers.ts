import { Expression } from 'mapbox-gl'
import { LayerProps } from 'react-map-gl'

import {
  circleRadiusLarge,
  circleRadiusSmall,
  fontSizeLarge,
  fontSizeSmall,
  groupCount,
  mapMarker,
  PoiFeature,
  textOffsetY,
} from 'api-client'
import { ThemeType } from 'build-configs/ThemeType'

export const clusterLayer = (theme: ThemeType): LayerProps => ({
  id: 'clusters',
  type: 'circle',
  source: 'point',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': ['step', ['get', 'point_count'], theme.colors.themeColor, groupCount, theme.colors.themeColor],
    'circle-radius': ['step', ['get', 'point_count'], circleRadiusSmall, groupCount, circleRadiusLarge],
  },
})
export const markerLayer = (currentFeature: PoiFeature | null): LayerProps => ({
  id: 'point',
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
    'text-field': ['case', ['==', ['length', ['get', 'pois']], 1], ['get', 'title', ['at', 0, ['get', 'pois']]], ''],
    'text-font': ['Roboto Regular'],
    'text-offset': [0, textOffsetY],
    'text-anchor': 'top',
    'text-size': fontSizeSmall,
    'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
  },
  paint: {},
})

export const clusterProperties: { [key: string]: Expression } = {
  sum: ['+', ['length', ['get', 'pois']]],
}

export const clusterCountLayer: LayerProps = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'point',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': ['get', 'sum'],
    'text-font': ['Roboto Regular'],
    'text-size': ['step', ['get', 'point_count'], fontSizeSmall, groupCount, fontSizeLarge],
    'text-allow-overlap': true,
  },
}
