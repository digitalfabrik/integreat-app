import { LayerProps } from 'react-map-gl'

import { mapMarker, PoiFeature } from 'api-client'
import { ThemeType } from 'build-configs/ThemeType'

const textOffsetY = 1.25

const groupCount = 50
const circleRadiusSmall = 20
const circleRadiusLarge = 30
const fontSizeSmall = 12
const fontSizeLarge = 16

export const clusterLayer = (theme: ThemeType): LayerProps => ({
  id: 'clusters',
  type: 'circle',
  source: 'point',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': [
      'step',
      ['get', 'point_count'],
      theme.colors.themeColor,
      groupCount,
      theme.colors.themeColor,
    ],
    'circle-radius': ['step', ['get', 'point_count'], circleRadiusSmall, groupCount, circleRadiusLarge],
  },
})
export const markerLayer = (currentFeature: PoiFeature | null): LayerProps => ({
  id: 'point',
  type: 'symbol',
  source: 'point',
  layout: {
    'icon-allow-overlap': true,
    'icon-ignore-placement': true,
    'icon-size': mapMarker.iconSize,
    'icon-image': [
      'case',
      ['==', ['get', 'id'], currentFeature?.properties.id ?? -1],
      mapMarker.symbolActive,
      ['get', 'symbol'],
    ],
    'text-field': ['get', 'title'],
    'text-font': ['Roboto Regular'],
    'text-offset': [0, textOffsetY],
    'text-anchor': 'top',
    'text-size': fontSizeSmall,
  },
  paint: {},
})

export const clusterCountLayer: LayerProps = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'point',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['Roboto Regular'],
    'text-size': ['step', ['get', 'point_count'], fontSizeSmall, groupCount, fontSizeLarge],
  },
}
