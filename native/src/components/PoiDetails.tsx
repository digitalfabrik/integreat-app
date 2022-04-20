import Clipboard from '@react-native-clipboard/clipboard'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { PoiFeature, PoiModel } from 'api-client'

import ExternalLinkIcon from '../assets/ExternalLink.svg'
import Placeholder from '../assets/PoiPlaceholderLarge.jpg'
import useSnackbar from '../hooks/useSnackbar'
import { getNavigationDeepLinks } from '../utils/getNavigationDeepLinks'
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
  const { title } = poi

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
      <StyledText>{title}</StyledText>
      {distance && <StyledDistance>{t('distanceKilometre', { distance })}</StyledDistance>}
      <Thumbnail source={thumbnail} resizeMode='cover' />
      <HorizontalLine />
      <PoiDetailItem onPress={onNavigate} icon={<ExternalLink source={ExternalLinkIcon} />} language={language}>
        <TextWrapper onPress={location ? copyToClipboard(location) : undefined}>
          <Text>{address}</Text>
          <Text>
            {postcode} {town}
          </Text>
        </TextWrapper>
      </PoiDetailItem>
      <HorizontalLine />
      <CollapsibleItem initExpanded headerText={t('description')} language={language}>
        <ContentWrapper>
          <NativeHtml content={poi.content} language={language} />
        </ContentWrapper>
      </CollapsibleItem>
      <HorizontalLine />
    </PoiDetailsContainer>
  )
}

export default PoiDetails
