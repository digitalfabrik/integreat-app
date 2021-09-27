import type { Feature, Point } from 'geojson'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { POIS_ROUTE, RouteInformationType } from 'api-client'

type MapPopupProps = {
  feature: Feature<Point>
  navigateTo: (routeInformation: RouteInformationType) => void
  language: string
  cityCode: string
}

const Popup = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  position: absolute;
  bottom: 16px;
  width: 90%;
  height: 30%;
  background-color: ${props => props.theme.colors.backgroundColor};
  z-index: 10;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 5px #29000000;
`

const Thumbnail = styled.Image`
  border-radius: 5px;
  width: 100px;
  height: 100px;
`

const Title = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
`

const DistanceInfo = styled.Text`
  color: ${props => props.theme.colors.textColor};
`

const InformationContainer = styled.View`
  padding: 32px;
  align-items: flex-start;
  justify-content: center;
`

const MapPopup: React.FC<MapPopupProps> = ({
  feature,
  navigateTo,
  cityCode,
  language
}: MapPopupProps): ReactElement => {
  const { t } = useTranslation('pois')
  if (!feature.properties?.path) {
    return
  }
  return (
    <Popup
      onPress={
        feature.properties?.path
          ? () =>
              navigateTo({
                route: POIS_ROUTE,
                cityCode: cityCode,
                languageCode: language,
                cityContentPath: feature.properties?.path
              })
          : undefined
      }
      activeOpacity={1}>
      {feature.properties?.thumbnail && <Thumbnail source={{ uri: feature.properties.thumbnail }} />}
      <InformationContainer>
        {feature.properties?.title && <Title>{feature.properties.title}</Title>}
        {feature.properties?.distance && (
          <Infos>
            {feature.properties.distance} {t('unit')} {t('distanceText')}
          </Infos>
        )}
      </InformationContainer>
    </Popup>
  )
}

export default MapPopup
