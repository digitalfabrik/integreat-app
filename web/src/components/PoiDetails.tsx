import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { Fragment, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { getExternalMapsLink } from 'shared'
import { PoiModel } from 'shared/api'

import { helpers } from '../constants/theme'
import useDimensions from '../hooks/useDimensions'
import Collapsible from './Collapsible'
import Contact from './Contact'
import OpeningHours from './OpeningHours'
import PoiChips from './PoiChips'
import RemoteContent from './RemoteContent'
import Icon from './base/Icon'
import Link from './base/Link'

const StyledDivider = styled(Divider)`
  margin: 12px 0;
`

const DetailsContainer = styled('div')`
  font-family: ${props => props.theme.legacy.fonts.web.contentFont};
`

const StyledIcon = styled(Icon)`
  flex-shrink: 0;
  object-fit: contain;
  align-self: center;
`

const StyledExternalLinkIcon = styled(StyledIcon)`
  width: 16px;
  height: 16px;
  color: ${props => props.theme.legacy.colors.linkColor};
`

const Thumbnail = styled('img')`
  height: clamp(120px, 14vh, 160px);
  width: 100%;
  flex-shrink: 0;
  border: 1px solid transparent;
  object-fit: cover;
  border-radius: 10px;

  ${props => props.theme.breakpoints.down('md')} {
    order: 1;
    margin-top: 12px;
  }
`

const Distance = styled('div')`
  ${helpers.adaptiveFontSize};
`

const AddressContentWrapper = styled('div')`
  display: flex;
  ${helpers.adaptiveFontSize};
  gap: 8px;
`

const AddressContent = styled('div')`
  display: flex;
  flex-direction: column;
  ${helpers.adaptiveFontSize};

  ${props => props.theme.breakpoints.down('md')} {
    align-self: center;
  }
`

const Heading = styled('div')`
  margin: 12px 0;
  font-weight: 700;
`

const Subheading = styled('div')`
  margin: 12px 0;
  font-weight: 700;
  ${helpers.adaptiveFontSize};
`

const StyledLink = styled(Link)`
  display: flex;
  margin-top: 8px;
  gap: 8px;
`

const LinkLabel = styled('span')`
  color: ${props => props.theme.legacy.colors.linkColor};
  ${helpers.adaptiveFontSize};
  align-self: flex-end;
`

const DetailSection = styled('div')`
  display: flex;
  flex-direction: column;

  ${props => props.theme.breakpoints.down('md')} {
    flex-direction: row;
    justify-content: space-between;
  }
`

const StyledCollapsible = styled(Collapsible)`
  gap: 0;
`

const StyledContactsContainer = styled('div')`
  margin-top: 12px;
`

type PoiDetailsProps = {
  poi: PoiModel
  distance: number | null
}

const PoiDetails = ({ poi, distance }: PoiDetailsProps): ReactElement => {
  const { desktop } = useDimensions()
  const { t } = useTranslation('pois')
  const { content, location, contacts, isCurrentlyOpen, openingHours, temporarilyClosed, appointmentUrl } = poi

  const isAndroid = /Android/i.test(navigator.userAgent)
  const externalMapsLink = getExternalMapsLink(location, isAndroid ? 'android' : 'web')

  return (
    <DetailsContainer>
      <Stack gap={1}>
        <Heading>{poi.title}</Heading>
        {distance !== null && <Distance>{t('distanceKilometre', { distance: distance.toFixed(1) })}</Distance>}
        <PoiChips poi={poi} />
        {!!poi.thumbnail && <Thumbnail alt='' src={poi.thumbnail} />}
      </Stack>
      <StyledDivider />
      {desktop && <Subheading>{t('detailsAddress')}</Subheading>}
      <DetailSection>
        <AddressContentWrapper>
          {desktop && <StyledIcon src={LocationOnOutlinedIcon} />}
          <AddressContent>
            <span>{location.address}</span>
            <span>
              {location.postcode} {location.town}
            </span>
          </AddressContent>
        </AddressContentWrapper>
        <StyledLink to={externalMapsLink}>
          {desktop && <LinkLabel>{t('detailsMapLink')}</LinkLabel>}
          <StyledExternalLinkIcon src={OpenInNewIcon} directionDependent />
        </StyledLink>
      </DetailSection>
      {contacts.length > 0 && (
        <>
          <StyledDivider />
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
          <StyledDivider />
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
          <StyledDivider />
          <Collapsible title={t('detailsInformation')}>
            <RemoteContent html={content} smallText />
          </Collapsible>
        </>
      )}
    </DetailsContainer>
  )
}

export default PoiDetails
