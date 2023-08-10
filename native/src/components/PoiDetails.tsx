import EmailIcon from 'integreat-app/assets/icons/email.svg'
import PhoneIcon from 'integreat-app/assets/icons/phone.svg'
import WebsiteIcon from 'integreat-app/assets/icons/website.svg'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { MapPoi, PoiModel } from 'api-client'

import Placeholder from '../assets/PoiPlaceholderLarge.jpg'
import AddressInfo from './AddressInfo'
import CollapsibleItem from './CollapsibleItem'
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
  mapPoi: MapPoi
  language: string
}

const PoiDetails = ({ poi, mapPoi, language }: PoiDetailsProps): ReactElement => {
  const { t } = useTranslation('pois')

  // TODO IGAPP-920: this has to be removed when we get proper images from CMS
  const thumbnail = mapPoi.thumbnail?.replace('-150x150', '') ?? Placeholder
  const distance = mapPoi.distance
  const { title, content, email, website, phoneNumber, openingHours, temporarilyClosed, isCurrentlyOpen, category } =
    poi

  const contactInformationCollapsibleItem = (
    <CollapsibleItem initExpanded headerContent={t('contactInformation')} language={language}>
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
        <PoiDetailRow externalUrl={`mailto:${email}`} accessibilityLabel={t('eMail')} text={email} Icon={EmailIcon} />
      )}
    </CollapsibleItem>
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
          <CollapsibleItem initExpanded headerContent={t('description')} language={language}>
            <Page content={content} language={language} path={poi.path} padding={false} />
          </CollapsibleItem>
          <HorizontalLine />
        </>
      )}
    </PoiDetailsContainer>
  )
}

export default PoiDetails
