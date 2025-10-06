import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography, { TypographyProps } from '@mui/material/Typography'
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

const StyledIcon = styled(Icon)`
  flex-shrink: 0;
  object-fit: contain;
  align-self: center;
`

const StyledExternalLinkIcon = styled(StyledIcon)`
  width: 16px;
  height: 16px;
  color: ${props => props.theme.palette.primary.main};
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

const StyledTypography = styled(Typography)<TypographyProps>`
  color: ${props => props.theme.palette.text.neutral};
`

const AddressContentWrapper = styled('div')`
  display: flex;
  ${helpers.adaptiveFontSize};
  gap: 8px;
`

const AddressContent = styled(Typography)<TypographyProps>`
  display: flex;
  flex-direction: column;
  color: ${props => props.theme.palette.text.neutral};

  ${props => props.theme.breakpoints.down('md')} {
    align-self: center;
  }
`

const StyledLink = styled(Link)`
  display: flex;
  margin-top: 8px;
  gap: 8px;
`

const LinkLabel = styled(Typography)<TypographyProps>`
  color: ${props => props.theme.palette.primary.main};
  align-self: flex-end;
`

const StyledStack = styled(Stack)`
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

const ToolbarWrapper = styled('div')`
  display: flex;
  justify-content: center;
`

type PoiDetailsProps = {
  poi: PoiModel
  distance: number | null
  toolbar?: ReactElement
}

const PoiDetails = ({ poi, distance, toolbar }: PoiDetailsProps): ReactElement => {
  const { desktop } = useDimensions()
  const { t } = useTranslation('pois')
  const { content, location, contacts, isCurrentlyOpen, openingHours, temporarilyClosed, appointmentUrl } = poi

  const isAndroid = /Android/i.test(navigator.userAgent)
  const externalMapsLink = getExternalMapsLink(location, isAndroid ? 'android' : 'web')

  return (
    <Box>
      <Stack direction='column' spacing={1}>
        <Typography variant='title2' component='h1'>
          {poi.title}
        </Typography>
        {distance !== null && (
          <StyledTypography variant='label1' component='p'>
            {t('distanceKilometre', { distance: distance.toFixed(1) })}
          </StyledTypography>
        )}
        <PoiChips poi={poi} />
        {!!poi.thumbnail && <Thumbnail alt='' src={poi.thumbnail} />}
      </Stack>
      <StyledDivider />
      {desktop && (
        <StyledTypography variant='label1' component='h2'>
          {t('detailsAddress')}
        </StyledTypography>
      )}
      <StyledStack direction='column' spacing={1}>
        <AddressContentWrapper>
          {desktop && <StyledIcon src={LocationOnOutlinedIcon} />}
          <AddressContent variant='body2' component='div'>
            <span>{location.address}</span>
            <span>
              {location.postcode} {location.town}
            </span>
          </AddressContent>
        </AddressContentWrapper>
        <StyledLink to={externalMapsLink}>
          {desktop && (
            <LinkLabel variant='title3' component='span'>
              {t('detailsMapLink')}
            </LinkLabel>
          )}
          <StyledExternalLinkIcon src={OpenInNewIcon} directionDependent />
        </StyledLink>
      </StyledStack>
      {contacts.length > 0 && (
        <>
          <StyledDivider />
          <StyledCollapsible title={t('contacts')}>
            <StyledContactsContainer>
              {contacts.map((contact, index) => (
                <Fragment key={contact.headline ?? contact.website ?? contact.name ?? contact.phoneNumber}>
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
      {toolbar && (
        <>
          <StyledDivider />
          <ToolbarWrapper>{toolbar}</ToolbarWrapper>
        </>
      )}
    </Box>
  )
}

export default PoiDetails
