import Clipboard from '@react-native-clipboard/clipboard'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Text } from 'react-native'
import styled from 'styled-components/native'

import { getExternalMapsLink, PoiFeature, PoiModel } from 'api-client'

import ExternalLinkIcon from '../assets/ExternalLink.svg'
import Placeholder from '../assets/PoiPlaceholderLarge.jpg'
import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
import CollapsibleItem from './CollapsibleItem'
import HorizontalLine from './HorizontalLine'
import NativeHtml from './NativeHtml'
import PoiDetailItem from './PoiDetailItem'
import SimpleImage from './SimpleImage'

type PoiDetailsProps = {
  poi: PoiModel
  feature: PoiFeature
  language: string
}

const Thumbnail = styled(SimpleImage)`
  flex: 1;
  height: 180px;
  width: 100%;
  border-radius: 7px;
`

const PoiDetailsContainer = styled.View`
  flex: 1;
  padding: 0 18px;
`

const StyledText = styled.Text`
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 8px;
`

const StyledDistance = styled.Text`
  font-size: 12px;
  margin-bottom: 16px;
`

const ExternalLink = styled.Image`
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`

const ContentWrapper = styled.View`
  padding-right: 32px;
`

const TextWrapper = styled.Pressable``

const PoiDetails: React.FC<PoiDetailsProps> = ({ poi, feature, language }: PoiDetailsProps): ReactElement => {
  const { t } = useTranslation('pois')
  const showSnackbar = useSnackbar()

  // TODO IGAPP-920: this has to be removed when we get proper images from CMS
  const thumbnail = feature.properties.thumbnail?.replace('-150x150', '') ?? Placeholder
  const { location, address, postcode, town } = poi.location
  const { distance } = feature.properties
  const { title, content } = poi

  const onNavigate = () => {
    const navigationUrl = getExternalMapsLink(poi.location, Platform.OS)
    if (navigationUrl) {
      openExternalUrl(navigationUrl).catch(() => showSnackbar(t('error:noSuitableAppInstalled')))
    }
  }

  const copyLocationToClipboard = (): void => {
    if (location) {
      Clipboard.setString(location)
      showSnackbar(t('addressCopied'))
    }
  }

  return (
    <PoiDetailsContainer>
      <StyledText>{title}</StyledText>
      {distance && <StyledDistance>{t('distanceKilometre', { distance })}</StyledDistance>}
      <Thumbnail source={thumbnail} resizeMode='cover' />
      <HorizontalLine />
      <PoiDetailItem onPress={onNavigate} icon={<ExternalLink source={ExternalLinkIcon} />} language={language}>
        <TextWrapper onPress={copyLocationToClipboard}>
          <Text>{address}</Text>
          <Text>{[postcode, town].filter(it => it).join(' ')}</Text>
        </TextWrapper>
      </PoiDetailItem>
      <HorizontalLine />
      {content.length > 0 && (
        <>
          <CollapsibleItem initExpanded headerText={t('description')} language={language}>
            <ContentWrapper>
              <NativeHtml content={content} language={language} />
            </ContentWrapper>
          </CollapsibleItem>
          <HorizontalLine />
        </>
      )}
    </PoiDetailsContainer>
  )
}

export default PoiDetails
