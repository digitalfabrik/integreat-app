import { CircleLayerProps, SymbolLayerProps } from '@react-native-mapbox-gl/maps'

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

export const clusterLayer = (theme: ThemeType): CircleLayerProps => ({
  id: 'clusteredPoints',
  belowLayerID: 'pointCount',
  filter: ['has', 'point_count'],
  style: {
    circleColor: ['step', ['get', 'point_count'], theme.colors.themeColor, groupCount, theme.colors.themeColor],
    circleRadius: ['step', ['get', 'point_count'], circleRadiusSmall, groupCount, circleRadiusLarge],
  },
})

export const markerLayer = (selectedFeature: PoiFeature | null, featureLayerId: string): SymbolLayerProps => ({
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
    textField: ['case', ['==', ['length', ['get', 'pois']], 1], ['get', 'title', ['at', 0, ['get', 'pois']]], ''],
    textFont: ['Roboto Regular'],
    textOffset: [0, textOffsetY],
    textAnchor: 'top',
    textSize: fontSizeSmall,
    textVariableAnchor: ['top', 'bottom', 'left', 'right'],
  },
})

export const clusterCountLayer: SymbolLayerProps = {
  id: 'pointCount',
  filter: ['has', 'point_count'],
  style: {
    textField: '{point_count_abbreviated}',
    textFont: ['Roboto Regular'],
    textSize: ['step', ['get', 'point_count'], fontSizeSmall, groupCount, fontSizeLarge],
    textAllowOverlap: true,
  },
}
