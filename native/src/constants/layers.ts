/* eslint-disable @typescript-eslint/naming-convention */
import { CircleLayerStyle, SymbolLayerStyle } from '@maplibre/maplibre-react-native'

import { LegacyThemeType } from 'build-configs/LegacyThemeType'
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
} from 'shared'

type clusterLayerType = {
  id: string
  style: CircleLayerStyle
}

export const clusterLayer = (theme: LegacyThemeType): clusterLayerType => ({
  id: clusterLayerId,
  style: {
    circleColor: ['case', ['has', 'point_count'], theme.colors.themeColor, 'transparent'],
    circleRadius: ['step', ['get', 'point_count'], circleRadiusSmall, groupCount, circleRadiusLarge],
  },
})

type markerLayerType = {
  id: string
  style: SymbolLayerStyle
}

export const markerLayer = (selectedFeature: MapFeature | null): markerLayerType => ({
  id: featureLayerId,
  style: {
    symbolPlacement: 'point',
    symbolZOrder: 'source',
    iconAllowOverlap: true,
    textAllowOverlap: true,
    iconSize: mapMarker.iconSize,
    iconIgnorePlacement: true,
    iconImage: [
      'case',
      ['==', ['get', 'id', ['at', 0, ['get', 'pois']]], selectedFeature?.properties.pois[0]?.id ?? -1],
      mapMarker.symbolActive,
      [
        'case',
        ['==', ['length', ['get', 'pois']], 1],
        ['get', 'symbol', ['at', 0, ['get', 'pois']]],
        mapMarker.multipoi,
      ],
    ],
    iconOffset: [
      'case',
      ['==', ['get', 'id', ['at', 0, ['get', 'pois']]], selectedFeature?.properties.pois[0]?.id ?? -1],
      ['literal', [0, mapMarker.offsetY ?? 0]],
      ['literal', [0, 0]],
    ],
    textField: ['case', ['==', ['length', ['get', 'pois']], 1], ['get', 'title', ['at', 0, ['get', 'pois']]], ''],
    textFont: ['Noto Sans Regular'],
    textOffset: [0, textOffsetY],
    textAnchor: 'top',
    textSize: fontSizeSmall,
    textVariableAnchor: ['top', 'bottom', 'left', 'right'],
  },
})

type clusterCountLayerType = {
  id: string
  style: SymbolLayerStyle
}

export const clusterCountLayer: clusterCountLayerType = {
  id: 'pointCount',
  style: {
    textField: '{point_count_abbreviated}',
    textFont: ['Noto Sans Regular'],
    textSize: ['step', ['get', 'point_count'], fontSizeSmall, groupCount, fontSizeLarge],
    textAllowOverlap: true,
  },
}
