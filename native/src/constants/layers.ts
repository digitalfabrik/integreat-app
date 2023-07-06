import { CircleLayerStyle, SymbolLayerStyle } from '@rnmapbox/maps'

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

export const clusterLayer = (theme: ThemeType): CircleLayerStyle => ({
  id: 'clusteredPoints',
  belowLayerID: 'pointCount',
  filter: ['has', 'point_count'],
  style: {
    circleColor: ['step', ['get', 'point_count'], theme.colors.themeColor, groupCount, theme.colors.themeColor],
    circleRadius: ['step', ['get', 'point_count'], circleRadiusSmall, groupCount, circleRadiusLarge],
  },
})

export const markerLayer = (selectedFeature: PoiFeature | null, featureLayerId: string): SymbolLayerStyle => ({
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
      ['==', ['get', 'id'], selectedFeature?.properties.id ?? -1],
      mapMarker.symbolActive,
      ['get', 'symbol'],
    ],
    textField: ['get', 'title'],
    textFont: ['Roboto Regular'],
    textOffset: [0, textOffsetY],
    textAnchor: 'top',
    textSize: fontSizeSmall,
    textVariableAnchor: ['top', 'bottom', 'left', 'right'],
  },
})

export const clusterCountLayer: SymbolLayerStyle = {
  id: 'pointCount',
  style: {
    textField: '{point_count_abbreviated}',
    textFont: ['Roboto Regular'],
    textSize: ['step', ['get', 'point_count'], fontSizeSmall, groupCount, fontSizeLarge],
    textAllowOverlap: true,
  },
}
