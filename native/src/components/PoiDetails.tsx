import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Linking, Text, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components/native'

import { PoiFeature, PoiModel } from 'api-client/src'

import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import { contentDirection } from '../constants/contentDirection'
import { getNavigationDeepLinks } from '../utils/getNavigationDeepLinks'
import RemoteContent from './RemoteContent'
import SimpleImage from './SimpleImage'

type PoiDetailsProps = {
  poi: PoiModel
  feature: PoiFeature
  detailView: boolean
  navigateToPois: () => void
  language: string
}

const Thumbnail = styled(SimpleImage)`
  width: 100%;
  height: 180px;
`

const Title = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  font-size: 20px;
`

const DistanceInfo = styled.Text`
  padding: 0% 15% 7% 15%;
  color: ${props => props.theme.colors.textColor};
`

const LocationContainer = styled(TouchableOpacity)`
  padding: 5% 15%;
  border-style: solid;
  border-color: ${props => props.theme.colors.textColor};
  border-top-width: 1px;
  border-bottom-width: 1px;
  width: 100%;
`

const InformationContainer = styled.View<{ language: string }>`
  padding: 32px 0;
  align-items: flex-start;
  justify-content: center;
  flex: 1;
`

const PoiDetails: React.FC<PoiDetailsProps> = ({
  poi,
  feature,
  detailView,
  navigateToPois,
  language
}: PoiDetailsProps): ReactElement => {
  const { t } = useTranslation('pois')
  let navigationUrl: string | undefined | null = null
  if (poi.location.location && poi.featureLocation?.geometry.coordinates) {
    navigationUrl = getNavigationDeepLinks(poi.location.location, poi.featureLocation.geometry.coordinates)
  }
  const thumbnail = feature.properties.thumbnail?.replace('-150x150', '') ?? EventPlaceholder1

  // TODO change content direction according to language
  return (
    <View style={{ flexGrow: 1 }}>
      <Thumbnail source={thumbnail} resizeMode='cover' />
      <InformationContainer language={language}>
        {detailView && <Title>{feature.properties.title}</Title>}
        {feature.properties.distance && (
          <DistanceInfo>
            {feature.properties.distance} {t('unit')} {t('distanceText')}
          </DistanceInfo>
        )}
        <LocationContainer activeOpacity={1} onPress={() => navigationUrl && Linking.openURL(navigationUrl)}>
          <Text style={{ textDecorationLine: 'underline' }}>{poi.location.address}</Text>
          <Text style={{ textDecorationLine: 'underline' }}>
            {poi.location.postcode} {poi.location.town}
          </Text>
        </LocationContainer>
      </InformationContainer>
      {detailView && <Button title={t('map')} onPress={navigateToPois} />}
    </View>
  )
}

export default PoiDetails
