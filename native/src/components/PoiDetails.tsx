import Clipboard from '@react-native-clipboard/clipboard'
import EmailIcon from 'integreat-app/assets/icons/email.svg'
import PhoneIcon from 'integreat-app/assets/icons/phone.svg'
import WebsiteIcon from 'integreat-app/assets/icons/website.svg'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Pressable, Text } from 'react-native'
import styled from 'styled-components/native'

import { getExternalMapsLink, PoiFeature, PoiModel } from 'api-client'

import ExternalLinkIcon from '../assets/ExternalLink.svg'
import Placeholder from '../assets/PoiPlaceholderLarge.jpg'
import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
import CollapsibleItem from './CollapsibleItem'
import HorizontalLine from './HorizontalLine'
import NativeHtml from './NativeHtml'
import OpeningHours from './OpeningHours'
import PoiDetailItem from './PoiDetailItem'
import PoiDetailRow from './PoiDetailRow'
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

type PoiDetailsProps = {
  poi: PoiModel
  feature: PoiFeature
  language: string
}

const PoiDetails = ({ poi, feature, language }: PoiDetailsProps): ReactElement => {
  const { t } = useTranslation('pois')
  const showSnackbar = useSnackbar()

  // TODO IGAPP-920: this has to be removed when we get proper images from CMS
  const thumbnail = feature.properties.thumbnail?.replace('-150x150', '') ?? Placeholder
  const { address, postcode, town } = poi.location
  const { distance } = feature.properties
  const { title, content, email, website, phoneNumber, openingHours, temporarilyClosed, isCurrentlyOpen } = poi

  const openExternalMaps = () => {
    const externalMapsUrl = getExternalMapsLink(poi.location, Platform.OS)
    openExternalUrl(externalMapsUrl).catch(() => showSnackbar(t('error:noSuitableAppInstalled')))
  }

  const copyLocationToClipboard = (): void => {
    Clipboard.setString(`${address}, ${postcode} ${town}`)
    showSnackbar(t('addressCopied'))
  }

  const contactInformationCollapsibleItem = (
    <CollapsibleItem initExpanded headerContent={t('contactInformation')} language={language}>
      <ContentWrapper>
        {!!website && (
          <PoiDetailRow externalUrl={website} accessibilityLabel={t('website')} text={website} icon={WebsiteIcon} />
        )}
        {!!phoneNumber && (
          <PoiDetailRow
            externalUrl={`tel:${phoneNumber}`}
            accessibilityLabel={t('phone')}
            text={phoneNumber}
            icon={PhoneIcon}
          />
        )}
        {!!email && (
          <PoiDetailRow externalUrl={`mailto:${email}`} accessibilityLabel={t('eMail')} text={email} icon={EmailIcon} />
        )}
      </ContentWrapper>
    </CollapsibleItem>
  )

  return (
    <PoiDetailsContainer>
      <StyledText>{title}</StyledText>
      {!!distance && <StyledDistance>{t('distanceKilometre', { distance })}</StyledDistance>}
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
      {!!(website || phoneNumber || email) && (
        <>
          {contactInformationCollapsibleItem}
          <HorizontalLine />
        </>
      )}
      <>
        <OpeningHours
          language={language}
          openingHours={openingHours}
          isCurrentlyOpen={isCurrentlyOpen}
          isTemporarilyClosed={temporarilyClosed}
        />
      </>
      {content.length > 0 && (
        <>
          <CollapsibleItem initExpanded headerContent={t('description')} language={language}>
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
