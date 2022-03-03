import Clipboard from '@react-native-clipboard/clipboard'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { PoiFeature, PoiModel } from 'api-client'

import Placeholder from '../assets/PoiPlaceholderLarge.jpg'
import useSnackbar from '../hooks/useSnackbar'
import { getNavigationDeepLinks } from '../utils/getNavigationDeepLinks'
import openExternalUrl from '../utils/openExternalUrl'
import CollapsibleItem from './CollapsibleItem'
import NativeHtml from './NativeHtml'
import PoiDetailItem from './PoiDetailItem'
import SimpleImage from './SimpleImage'

type PoiDetailsProps = {
  poi: PoiModel
  feature: PoiFeature
  /** define whether content will be displayed on separate detail page */
  detailPage: boolean
  navigateToPois: () => void
  /** language to offer rtl support */
  language: string
}

const Thumbnail = styled(SimpleImage)`
  flex: 1;
  height: 180px;
  width: 100%;
`

const Title = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  font-size: 20px;
  padding: 32px 48px;
  flex: 1;
`

const TitleContainer = styled.View`
  flex-direction: row;
  border-style: solid;
  border-color: ${props => props.theme.colors.textDisabledColor};
  border-bottom-width: 1px;
`

const InformationContainer = styled.View<{ detailPage: boolean }>`
  align-items: flex-start;
  justify-content: center;
  border-style: solid;
  border-color: ${props => props.theme.colors.textDisabledColor};
  border-bottom-width: 1px;
  border-top-width: ${props => (props.detailPage ? 0 : '1px')};
  margin-top: ${props => (props.detailPage ? 0 : '32px')};
`

const PoiDetailsContainer = styled.View`
  flex: 1;
`

const PoiDetails: React.FC<PoiDetailsProps> = ({
  poi,
  feature,
  detailPage,
  navigateToPois,
  language
}: PoiDetailsProps): ReactElement => {
  const { t } = useTranslation('pois')
  const showSnackbar = useSnackbar()

  // TODO IGAPP-920: this has to be removed when we get proper images from CMS
  const thumbnail = feature.properties.thumbnail?.replace('-150x150', '') ?? Placeholder
  const { location, address, postcode, town } = poi.location
  const { distance, title } = feature.properties

  const onNavigate = () => {
    const navigationUrl = getNavigationDeepLinks(poi.location)
    if (navigationUrl) {
      openExternalUrl(navigationUrl).catch(() => showSnackbar(t('error:noSuitableAppInstalled')))
    }
  }

  const copyToClipboard = (text: string) => (): void => {
    Clipboard.setString(text)
    showSnackbar(t('addressCopied'))
  }

  return (
    <PoiDetailsContainer>
      <Thumbnail source={thumbnail} resizeMode='cover' />
      <InformationContainer detailPage={detailPage}>
        {detailPage && (
          <TitleContainer>
            <Title>{title}</Title>
          </TitleContainer>
        )}
        {distance && (
          <PoiDetailItem icon='place' language={language} onPress={detailPage ? navigateToPois : undefined}>
            <Text>{t('distanceKilometre', { distance })}</Text>
          </PoiDetailItem>
        )}
        <PoiDetailItem
          onPress={onNavigate}
          icon='map'
          onLongPress={location ? copyToClipboard(location) : undefined}
          language={language}>
          <Text>{address}</Text>
          <Text>
            {postcode} {town}
          </Text>
        </PoiDetailItem>
        <CollapsibleItem initExpanded headerText={t('description')} language={language}>
          <NativeHtml content={poi.content} language={language} />
        </CollapsibleItem>
      </InformationContainer>
    </PoiDetailsContainer>
  )
}

export default PoiDetails
