import React, { Fragment, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'

import { getExternalMapsLink } from 'shared'
import { PoiModel } from 'shared/api'

import { ExternalLinkIcon, LocationIcon, PoiThumbnailPlaceholderLarge } from '../assets'
import dimensions from '../constants/dimensions'
import { helpers } from '../constants/theme'
import useWindowDimensions from '../hooks/useWindowDimensions'
import Collapsible from './Collapsible'
import Contact from './Contact'
import OpeningHours from './OpeningHours'
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

const Category = styled.div`
  ${helpers.adaptiveFontSize};
  color: ${props => props.theme.colors.textSecondaryColor};
  margin-top: 8px;
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
  const { content, location, contacts, isCurrentlyOpen, openingHours, temporarilyClosed, category, appointmentUrl } =
    poi

  const thumbnail = poi.thumbnail ?? PoiThumbnailPlaceholderLarge
  const isAndroid = /Android/i.test(navigator.userAgent)
  const externalMapsLink = getExternalMapsLink(location, isAndroid ? 'android' : 'web')
  const appointmentOverlayUrl = appointmentUrl ?? poi.contacts.find(contact => contact.website !== null)?.website ?? ''

  return (
    <DetailsContainer>
      <HeadingSection>
        <Thumbnail alt='' src={thumbnail} />
        <Heading>{poi.title}</Heading>
        {distance !== null && <Distance>{t('distanceKilometre', { distance: distance.toFixed(1) })}</Distance>}
        <Category>{category.name}</Category>
      </HeadingSection>
      <Spacer $borderColor={theme.colors.borderColor} />
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
      {contacts.map(contact => (
        <Fragment key={contact.headline ?? contact.website ?? contact.name ?? contact.phoneNumber}>
          <Spacer $borderColor={theme.colors.borderColor} />
          <Contact contact={contact} />
        </Fragment>
      ))}
      <>
        {((openingHours && openingHours.length > 0) || temporarilyClosed) && (
          <Spacer $borderColor={theme.colors.borderColor} />
        )}
        <OpeningHours
          openingHours={openingHours}
          isCurrentlyOpen={isCurrentlyOpen}
          isTemporarilyClosed={temporarilyClosed}
          appointmentOverlayLink={appointmentOverlayUrl}
        />
        {appointmentUrl !== null && (
          <StyledLink to={appointmentUrl}>
            <LinkLabel>{t('makeAppointment')}</LinkLabel>
            <StyledExternalLinkIcon src={ExternalLinkIcon} directionDependent />
          </StyledLink>
        )}
      </>
      {content.length > 0 && (
        <>
          <Spacer $borderColor={theme.colors.borderColor} />
          <Collapsible title={t('detailsInformation')}>
            <RemoteContent html={content} smallText />
          </Collapsible>
        </>
      )}
      {toolbar && (
        <>
          <Spacer $borderColor={theme.colors.borderColor} />
          <ToolbarWrapper>{toolbar}</ToolbarWrapper>
        </>
      )}
    </DetailsContainer>
  )
}

export default PoiDetails
