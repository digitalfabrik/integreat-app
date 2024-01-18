import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { GeoJsonPoi, PoiModel } from 'api-client'

import { MailIcon, PhoneIcon, PoiThumbnailPlaceholderLarge, WebsiteIcon } from '../assets'
import AddressInfo from './AddressInfo'
import Collapsible from './Collapsible'
import HorizontalLine from './HorizontalLine'
import OpeningHours from './OpeningHours'
import Page from './Page'
import PoiDetailRow from './PoiDetailRow'
import SimpleImage from './SimpleImage'

const Thumbnail = styled(SimpleImage)`
  flex: 1;
  height: 180px;
  width: 100%;
  border-radius: 8px;
  margin-top: 12px;
`

const PoiDetailsContainer = styled.View`
  flex: 1;
  padding: 0 18px;
`

const StyledText = styled.Text`
  font-size: 15px;
  font-weight: bold;
`

const StyledDistance = styled.Text`
  font-size: 12px;
  margin-top: 8px;
`

const StyledCategory = styled.Text`
  font-size: 12px;
  margin-top: 8px;
  color: ${props => props.theme.colors.textSecondaryColor};
`

type PoiDetailsProps = {
  poi: PoiModel
  poiFeature: GeoJsonPoi
  language: string
}

const PoiDetails = ({ poi, poiFeature, language }: PoiDetailsProps): ReactElement => {
  const { t } = useTranslation('pois')
  const thumbnail = poiFeature.thumbnail?.replace('-150x150', '') ?? PoiThumbnailPlaceholderLarge
  const distance = poiFeature.distance
  const { title, content, email, website, phoneNumber, openingHours, temporarilyClosed, isCurrentlyOpen, category } =
    poi

  const contactInformationCollapsibleItem = (
    <Collapsible headerContent={t('contactInformation')} language={language}>
      {!!website && (
        <PoiDetailRow externalUrl={website} accessibilityLabel={t('website')} text={website} Icon={WebsiteIcon} />
      )}
      {!!phoneNumber && (
        <PoiDetailRow
          externalUrl={`tel:${phoneNumber}`}
          accessibilityLabel={t('phone')}
          text={phoneNumber}
          Icon={PhoneIcon}
        />
      )}
      {!!email && (
        <PoiDetailRow externalUrl={`mailto:${email}`} accessibilityLabel={t('eMail')} text={email} Icon={MailIcon} />
      )}
    </Collapsible>
  )

  return (
    <PoiDetailsContainer>
      <StyledText>{title}</StyledText>
      {!!distance && <StyledDistance>{t('distanceKilometre', { distance })}</StyledDistance>}
      <StyledCategory>{category.name}</StyledCategory>
      <Thumbnail source={thumbnail} resizeMode='cover' />
      <HorizontalLine />
      <AddressInfo location={poi.location} language={language} />
      <HorizontalLine />
      {!!(website || phoneNumber || email) && (
        <>
          {contactInformationCollapsibleItem}
          <HorizontalLine />
        </>
      )}
      <OpeningHours
        language={language}
        openingHours={openingHours}
        isCurrentlyOpen={isCurrentlyOpen}
        isTemporarilyClosed={temporarilyClosed}
      />
      {content.length > 0 && (
        <>
          <Collapsible headerContent={t('description')} language={language}>
            <Page content={content} language={language} path={poi.path} padding={false} />
          </Collapsible>
          <HorizontalLine />
        </>
      )}
    </PoiDetailsContainer>
  )
}

export default PoiDetails
