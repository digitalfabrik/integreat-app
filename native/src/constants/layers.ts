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
  },
})

export const clusterCountLayer: SymbolLayerProps = {
  id: 'pointCount',
  style: {
    textField: '{point_count_abbreviated}',
    textFont: ['Roboto Regular'],
    textSize: ['step', ['get', 'point_count'], fontSizeSmall, groupCount, fontSizeLarge],
  },
}
