import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import React, { Fragment, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { getExternalMapsLink } from 'shared'
import { PoiModel } from 'shared/api'

import { ExternalLinkIcon, LocationIcon, PoiThumbnailPlaceholderLarge } from '../assets'
import dimensions from '../constants/dimensions'
import { helpers } from '../constants/theme'
import useWindowDimensions from '../hooks/useWindowDimensions'
import Collapsible from './Collapsible'
import Contact from './Contact'
import OpeningHours from './OpeningHours'
import PoiChips from './PoiChips'
import RemoteContent from './RemoteContent'
import Spacer from './Spacer'
import Icon from './base/Icon'
import Link from './base/Link'

const DetailsContainer = styled.div`
  font-family: ${props => props.theme.fonts.web.contentFont};
`

const StyledIcon = styled(Icon)`
  flex-shrink: 0;
  object-fit: contain;
  align-self: center;
`

const StyledExternalLinkIcon = styled(StyledIcon)`
  width: 16px;
  height: 16px;
`

const Thumbnail = styled.img`
  height: clamp(120px, 14vh, 160px);
  width: 100%;
  flex-shrink: 0;
  border: 1px solid transparent;
  object-fit: cover;
  border-radius: 10px;

  @media screen and (${dimensions.smallViewport}) {
    order: 1;
    margin-top: 12px;
  }
`

const Distance = styled.div`
  ${helpers.adaptiveFontSize};
`

const AddressContentWrapper = styled.div`
  display: flex;
  ${helpers.adaptiveFontSize};
  gap: 8px;
`

const AddressContent = styled.div`
  display: flex;
  flex-direction: column;
  ${helpers.adaptiveFontSize};

  @media ${dimensions.smallViewport} {
    align-self: center;
  }
`

const Heading = styled.div`
  margin: 12px 0;
  font-weight: 700;
`

const Subheading = styled.div`
  margin: 12px 0;
  font-weight: 700;
  ${helpers.adaptiveFontSize};
`

const StyledLink = styled(Link)`
  display: flex;
  margin-top: 8px;
  gap: 8px;
`

const LinkLabel = styled.span`
  color: ${props => props.theme.colors.linkColor};
  ${helpers.adaptiveFontSize};
  align-self: flex-end;
`

const HeadingSection = styled.div`
  display: flex;
  flex-direction: column;
`

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;

  @media screen and (${dimensions.smallViewport}) {
    flex-direction: row;
    justify-content: space-between;
  }
`

const StyledCollapsible = styled(Collapsible)`
  gap: 0;
`

const StyledContactsContainer = styled.div`
  margin-top: 12px;
`

const ToolbarWrapper = styled.div`
  display: flex;
  justify-content: center;
`

type PoiDetailsProps = {
  poi: PoiModel
  distance: number | null
  toolbar?: ReactElement
}

const PoiDetails = ({ poi, distance, toolbar }: PoiDetailsProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  const theme = useTheme()
  const { t } = useTranslation('pois')
  const { content, location, contacts, isCurrentlyOpen, openingHours, temporarilyClosed, appointmentUrl } = poi

  const thumbnail = poi.thumbnail ?? PoiThumbnailPlaceholderLarge
  const isAndroid = /Android/i.test(navigator.userAgent)
  const externalMapsLink = getExternalMapsLink(location, isAndroid ? 'android' : 'web')

  return (
    <DetailsContainer>
      <HeadingSection>
        <Thumbnail alt='' src={thumbnail} />
        <Heading>{poi.title}</Heading>
        {distance !== null && <Distance>{t('distanceKilometre', { distance: distance.toFixed(1) })}</Distance>}
        <PoiChips poi={poi} />
      </HeadingSection>
      <Spacer borderColor={theme.colors.borderColor} />
      {!viewportSmall && <Subheading>{t('detailsAddress')}</Subheading>}
      <DetailSection>
        <AddressContentWrapper>
          {!viewportSmall && <StyledIcon src={LocationIcon} />}
          <AddressContent>
            <span>{location.address}</span>
            <span>
              {location.postcode} {location.town}
            </span>
          </AddressContent>
        </AddressContentWrapper>
        <StyledLink to={externalMapsLink}>
          {!viewportSmall && <LinkLabel>{t('detailsMapLink')}</LinkLabel>}
          <StyledExternalLinkIcon src={ExternalLinkIcon} directionDependent />
        </StyledLink>
      </DetailSection>
      {contacts.length > 0 && (
        <>
          <Spacer borderColor={theme.colors.borderColor} />
          <StyledCollapsible title={t('contacts')}>
            <StyledContactsContainer>
              {contacts.map((contact, index) => (
                <Fragment
                  key={
                    contact.headline ?? contact.website ?? contact.name ?? contact.phoneNumber ?? contact.mobileNumber
                  }>
                  <Contact isLastContact={contacts.length - 1 === index} contact={contact} />
                </Fragment>
              ))}
            </StyledContactsContainer>
          </StyledCollapsible>
        </>
      )}
      {((openingHours && openingHours.length > 0) || temporarilyClosed || !!appointmentUrl) && (
        <>
          <Spacer borderColor={theme.colors.borderColor} />
          <OpeningHours
            openingHours={openingHours}
            isCurrentlyOpen={isCurrentlyOpen}
            isTemporarilyClosed={temporarilyClosed}
            appointmentUrl={appointmentUrl}
          />
        </>
      )}

      {content.length > 0 && (
        <>
          <Spacer borderColor={theme.colors.borderColor} />
          <Collapsible title={t('detailsInformation')}>
            <RemoteContent html={content} smallText />
          </Collapsible>
        </>
      )}
      {toolbar && (
        <>
          <Spacer borderColor={theme.colors.borderColor} />
          <ToolbarWrapper>{toolbar}</ToolbarWrapper>
        </>
      )}
    </DetailsContainer>
  )
}

export default PoiDetails
