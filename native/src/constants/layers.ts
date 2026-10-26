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
  style: {
    circleColor: ['case', ['has', 'point_count'], theme.colors.secondary, 'transparent'],
    circleRadius: ['step', ['get', 'point_count'], circleRadiusSmall, groupCount, circleRadiusLarge],
  },
})

export const markerLayer = (selectedFeature: MapFeature | null): LayerProps => ({
  id: featureLayerId,
  type: 'symbol',
  style: {
    symbolPlacement: 'point',
    symbolZOrder: 'source',
    iconAllowOverlap: true,
    textAllowOverlap: true,
    iconSize: mapMarker.iconSize,
    iconIgnorePlacement: true,
    iconImage: [
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
    iconOffset: [
      'case',
      [
        'all',
        ['==', ['length', ['get', 'places']], 1],
        ['==', ['get', 'id', ['at', 0, ['get', 'places']]], selectedFeature?.properties.places[0]?.id ?? -1],
      ],
      ['literal', [0, mapMarker.offsetY ?? 0]],
      ['literal', [0, 0]],
    ],
    textField: ['case', ['==', ['length', ['get', 'places']], 1], ['get', 'title', ['at', 0, ['get', 'places']]], ''],
    textFont: ['Noto Sans Regular'],
    textOffset: [0, textOffsetY],
    textAnchor: 'top',
    textSize: fontSizeSmall,
    textVariableAnchor: ['top', 'bottom', 'left', 'right'],
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
  style: {
    circleRadius: multiPlaceBackgroundRadius,
    circleColor: theme.colors.background,
    circleStrokeWidth: 1,
  },
})

export const multiPlaceBadgeLayer = (theme: DefaultTheme): LayerProps => ({
  id: multiPlaceBadgeLayerId,
  type: 'circle',
  filter: multiPlaceFilter,
  afterId: featureLayerId,
  style: {
    circleRadius: multiPlaceBadgeRadius,
    circleColor: theme.colors.outlineVariant,
    circleStrokeWidth: 1,
    circleStrokeColor: theme.colors.background,
    circleTranslate: multiPlaceBadgeOffset,
    circleTranslateAnchor: 'viewport',
  },
})

export const multiPlaceBadgeCountLayer = (theme: DefaultTheme): LayerProps => ({
  id: multiPlaceBadgeCountId,
  type: 'symbol',
  filter: multiPlaceFilter,
  style: {
    textField: ['to-string', ['length', ['get', 'places']]],
    textFont: ['Noto Sans Regular'],
    textSize: fontSizeSmall,
    textAllowOverlap: true,
    textIgnorePlacement: true,
    textColor: theme.colors.background,
    textTranslate: multiPlaceBadgeOffset,
    textTranslateAnchor: 'viewport',
  },
})

export const clusterCountLayer: LayerProps = {
  id: 'pointCount',
  type: 'symbol',
  style: {
    textField: '{point_count_abbreviated}',
    textFont: ['Noto Sans Regular'],
    textSize: ['step', ['get', 'point_count'], fontSizeSmall, groupCount, fontSizeLarge],
    textAllowOverlap: true,
  },
}
