import Clipboard from '@react-native-clipboard/clipboard'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, Text } from 'react-native'
import styled from 'styled-components/native'

import { PoiFeature, PoiModel } from 'api-client'

import EmailIcon from '../../../assets/icons/email.svg'
import PhoneIcon from '../../../assets/icons/phone.svg'
import WebsiteIcon from '../../../assets/icons/website.svg'
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

const Row = styled.View`
  flex-direction: row;
  padding-vertical: 3px;
`

const Icon = styled.Image`
  margin-horizontal: 5px;
`

type Props = {
  poi: PoiModel
  feature: PoiFeature
  language: string
}

const PoiDetails = ({ poi, feature, language }: Props): ReactElement => {
  const { t } = useTranslation('pois')
  const showSnackbar = useSnackbar()

  // TODO IGAPP-920: this has to be removed when we get proper images from CMS
  const thumbnail = feature.properties.thumbnail?.replace('-150x150', '') ?? Placeholder
  const { address, postcode, town } = poi.location
  const { distance } = feature.properties
  const { title, content, email, website, phoneNumber } = poi

  const openExternalMaps = () => {
    const externalMapsUrl = getNavigationDeepLinks(poi.location)
    openExternalUrl(externalMapsUrl).catch(() => showSnackbar(t('error:noSuitableAppInstalled')))
  }

  const copyLocationToClipboard = (): void => {
    Clipboard.setString(`${address}, ${postcode} ${town}`)
    showSnackbar(t('addressCopied'))
  }

  const contactInformationCollapsibleItem = (
    <CollapsibleItem initExpanded headerText={t('contactInformation')} language={language}>
      <ContentWrapper>
        {website && (
          <Row>
            <Icon source={WebsiteIcon} accessibilityLabel={t('website')} />
            <Pressable onPress={() => openExternalUrl(website)}>
              <Text>{website}</Text>
            </Pressable>
          </Row>
        )}
        {phoneNumber && (
          <Row>
            <Icon source={PhoneIcon} accessibilityLabel={t('phone')} />
            <Pressable onPress={() => openExternalUrl(`tel:${phoneNumber}`)}>
              <Text>{phoneNumber}</Text>
            </Pressable>
          </Row>
        )}
        {email && (
          <Row>
            <Icon source={EmailIcon} accessibilityLabel={t('eMail')} />
            <Pressable onPress={() => openExternalUrl(`mailto:${email}`)}>
              <Text>{email}</Text>
            </Pressable>
          </Row>
        )}
      </ContentWrapper>
    </CollapsibleItem>
  )

  return (
    <PoiDetailsContainer>
      <StyledText>{title}</StyledText>
      {distance && <StyledDistance>{t('distanceKilometre', { distance })}</StyledDistance>}
      <Thumbnail source={thumbnail} resizeMode='cover' />
      <HorizontalLine />
      <PoiDetailItem
        onIconPress={openExternalMaps}
        icon={<ExternalLink accessibilityLabel={t('openExternalMaps')} source={ExternalLinkIcon} />}
        language={language}>
        <Pressable onPress={copyLocationToClipboard}>
          <Text>{address}</Text>
          <Text>
            {postcode} {town}
          </Text>
        </Pressable>
      </PoiDetailItem>
      <HorizontalLine />
      {(website || phoneNumber || email) && (
        <>
          {contactInformationCollapsibleItem}
          <HorizontalLine />
        </>
      )}
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
