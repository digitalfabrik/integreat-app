import React, { ReactElement, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { PoiFeature, POIS_ROUTE, RouteInformationType } from 'api-client'

import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import SimpleImage from './SimpleImage'

type MapPopupProps = {
  feature: PoiFeature
  navigateTo: (routeInformation: RouteInformationType) => void
  language: string
  cityCode: string
  height: number
}

const Popup = styled.TouchableOpacity`
  flex-direction: row;
`

const StyledAnimatedView = styled(Animated.View)<{ height: number }>`
  justify-content: center;
  position: absolute;
  bottom: 12px;
  width: 95%;
  height: ${props => props.height}px;
  background-color: ${props => props.theme.colors.backgroundColor};
  z-index: 10;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 5px #29000000;
`

const Thumbnail = styled(SimpleImage)`
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
  language,
  height
}: MapPopupProps): ReactElement | null => {
  const { t } = useTranslation('pois')
  const fadeAnimation = useRef<Animated.Value>(new Animated.Value(0)).current

  // animation for fading in the popup
  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start()
  }, [fadeAnimation])

  if (!feature.properties.path) {
    return null
  }
  const thumbnail = feature.properties.thumbnail ?? EventPlaceholder1

  return (
    <StyledAnimatedView style={{ opacity: fadeAnimation }} height={height}>
      <Popup
        onPress={() =>
          navigateTo({
            route: POIS_ROUTE,
            cityCode,
            languageCode: language,
            cityContentPath: feature.properties.path
          })
        }
        activeOpacity={1}>
        <Thumbnail source={thumbnail} />
        <InformationContainer>
          <Title>{feature.properties.title}</Title>
          {feature.properties.distance && (
            <DistanceInfo>
              {feature.properties.distance} {t('unit')} {t('distanceText')}
            </DistanceInfo>
          )}
        </InformationContainer>
      </Popup>
    </StyledAnimatedView>
  )
}

export default MapPopup
