import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { getExternalMapsLink } from 'shared'
import { PoiModel } from 'shared/api'

import Contact from './Contact'
import OpeningHours from './OpeningHours'
import PoiChips from './PoiChips'
import RemoteContent from './RemoteContent'
import Accordion from './base/Accordion'
import Link from './base/Link'
import List from './base/List'

const StyledContactsList = styled(List)({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
})

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

type PoiDetailsProps = {
  poi: PoiModel
  distance: number | null
}

const PoiDetails = ({ poi, distance }: PoiDetailsProps): ReactElement => {
  const { t } = useTranslation('pois')
  const { content, location, contacts, isCurrentlyOpen, openingHours, temporarilyClosed, appointmentUrl } = poi

  const isAndroid = /Android/i.test(navigator.userAgent)
  const externalMapsLink = getExternalMapsLink(location, isAndroid ? 'android' : 'web')
  const showOpeningHours = (openingHours && openingHours.length > 0) || temporarilyClosed || !!appointmentUrl

  const addressSection = (
    <Stack paddingBlock={1} gap={1}>
      <StyledTypography variant='title3'>{t('detailsAddress')}</StyledTypography>
      <Button component={Link} to={externalMapsLink} color='inherit' startIcon={<LocationOnOutlinedIcon />} fullWidth>
        <Stack direction='row' width='100%' justifyContent='space-between' alignItems='center'>
          <Stack>
            <StyledTypography variant='body2'>{location.address}</StyledTypography>
            <StyledTypography variant='body2'>
              {location.postcode} {location.town}
            </StyledTypography>
          </Stack>
          <OpenInNewIcon color='primary' />
        </Stack>
      </Button>
    </Stack>
  )

  const contactsSection = contacts.length > 0 && (
    <>
      <Divider />
      <Accordion id='contacts' title={t('contacts')}>
        <StyledContactsList
          items={contacts.map(contact => (
            <Contact key={contact.headline} contact={contact} />
          ))}
          disablePadding
        />
      </Accordion>
    </>
  )

  const openingHoursSection = showOpeningHours && (
    <>
      <Divider />
      <OpeningHours
        openingHours={openingHours}
        isCurrentlyOpen={isCurrentlyOpen}
        isTemporarilyClosed={temporarilyClosed}
        appointmentUrl={appointmentUrl}
      />
    </>
  )

  return (
    <Stack>
      <Stack paddingBlock={1} gap={1}>
        <Typography variant='title1' component='h1'>
          {poi.title}
        </Typography>
        {distance !== null && (
          <StyledTypography variant='body2'>{t('distanceKilometre', { distance: distance.toFixed(1) })}</StyledTypography>
        )}
        <PoiChips poi={poi} />
        {!!poi.thumbnail && <Thumbnail alt='' src={poi.thumbnail} />}
      </Stack>
      <Divider />
      {addressSection}
      {contactsSection}
      {openingHoursSection}
      {content.length > 0 && (
        <>
          <Divider />
          <Accordion id='content' title={t('detailsInformation')}>
            <RemoteContent html={content} smallText />
          </Accordion>
        </>
      )}
    </Stack>
  )
}

export default PoiDetails
