import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Linking, Text } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { PoiFeature, PoiModel } from 'api-client/src'

import { mockContent } from '../__mocks__/poiCMSContent'
import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import { getNavigationDeepLinks } from '../utils/getNavigationDeepLinks'
import Caption from './Caption'
import NativeHtml from './NativeHtml'
import PoiDetailItem from './PoiDetailItem'
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

const PageContainer = styled.View`
  margin: 8px 32px;
  align-self: center;
`

const Title = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  font-size: 20px;
  padding: 32px 48px 16px 48px;
`

const InformationContainer = styled.View<{ language: string }>`
  align-items: flex-start;
  justify-content: center;
`

const PoiDetailsContainer = styled.View`
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
  const theme = useTheme()

  const thumbnail = feature.properties.thumbnail?.replace('-150x150', '') ?? EventPlaceholder1

  const onNavigate = () => {
    let navigationUrl: string | undefined | null = null
    if (poi.location.location && poi.featureLocation?.geometry.coordinates) {
      navigationUrl = getNavigationDeepLinks(poi.location.location, poi.featureLocation.geometry.coordinates)
    }
    if (navigationUrl) {
      Linking.openURL(navigationUrl)
    }
  }
  // TODO change content direction according to language
  return (
    <PoiDetailsContainer>
      <Thumbnail source={thumbnail} resizeMode='cover' />
      <InformationContainer language={language}>
        {detailView && <Title>{feature.properties.title}</Title>}
        {feature.properties.distance && (
          <PoiDetailItem icon='place'>
            <Text>
              {feature.properties.distance} {t('unit')} {t('distanceText')}
            </Text>
          </PoiDetailItem>
        )}
        <PoiDetailItem onPress={onNavigate} icon='map'>
          <Text>{poi.location.address}</Text>
          <Text>
            {poi.location.postcode} {poi.location.town}
          </Text>
        </PoiDetailItem>
        <PageContainer>
          <Caption title='Informationen' theme={theme} />
          <NativeHtml content={mockContent} language={language} />
        </PageContainer>
      </InformationContainer>
      {detailView && <Button title={t('map')} onPress={navigateToPois} />}
    </PoiDetailsContainer>
  )
}

export default PoiDetails
