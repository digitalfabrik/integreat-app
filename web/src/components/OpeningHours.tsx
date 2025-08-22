import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { weekdays } from 'shared'
import { OpeningHoursModel } from 'shared/api'

import { helpers } from '../constants/theme'
import Collapsible from './Collapsible'
import OpeningEntry from './OpeningEntry'
import Icon from './base/Icon'
import Link from './base/Link'

const OpeningLabel = styled('span')<{ isOpen: boolean }>`
  color: ${props =>
    props.isOpen ? props.theme.legacy.colors.positiveHighlight : props.theme.legacy.colors.negativeHighlight};
  padding-inline-end: 12px;
`

const Content = styled('div')`
  padding-inline-end: 26px;
  ${helpers.adaptiveFontSize};
`

const TitleContainer = styled('div')`
  display: flex;
  flex: 1;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  font-weight: 700;
  ${helpers.adaptiveFontSize};
`

const OpeningContainer = styled('div')`
  display: flex;
  align-items: center;
  gap: 8px;
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

const StyledExternalLinkIcon = styled(Icon)`
  flex-shrink: 0;
  object-fit: contain;
  align-self: center;
  width: 16px;
  height: 16px;
  color: ${props => props.theme.legacy.colors.linkColor};
`

type OpeningHoursTitleProps = {
  isCurrentlyOpen: boolean
  label?: string
}

const OpeningHoursTitle = ({ isCurrentlyOpen, label }: OpeningHoursTitleProps) => {
  const { t } = useTranslation('pois')
  return (
    <TitleContainer>
      <span>{t('openingHours')}</span>
      <OpeningContainer>
        <OpeningLabel isOpen={isCurrentlyOpen}>{t(label ?? (isCurrentlyOpen ? 'opened' : 'closed'))}</OpeningLabel>
      </OpeningContainer>
    </TitleContainer>
  )
}

type OpeningHoursProps = {
  isCurrentlyOpen: boolean
  openingHours: OpeningHoursModel[] | null
  isTemporarilyClosed: boolean
  appointmentUrl: string | null
}

const OpeningHours = ({
  isCurrentlyOpen,
  openingHours,
  isTemporarilyClosed,
  appointmentUrl,
}: OpeningHoursProps): ReactElement | null => {
  const { t } = useTranslation('pois')
  const appointmentOnly = !openingHours && !!appointmentUrl

  const AppointmentLink = appointmentUrl ? (
    <StyledLink to={appointmentUrl}>
      <LinkLabel>{t('makeAppointment')}</LinkLabel>
      <StyledExternalLinkIcon src={OpenInNewIcon} directionDependent />
    </StyledLink>
  ) : null

  if (isTemporarilyClosed || appointmentOnly) {
    return (
      <>
        <TitleContainer>
          <OpeningHoursTitle
            isCurrentlyOpen={isCurrentlyOpen}
            label={isTemporarilyClosed ? 'temporarilyClosed' : 'onlyWithAppointment'}
          />
        </TitleContainer>
        {AppointmentLink}
      </>
    )
  }

  if (openingHours?.length !== weekdays.length) {
    return null
  }

  return (
    <>
      <Collapsible title={<OpeningHoursTitle isCurrentlyOpen={isCurrentlyOpen} />} initialCollapsed={!isCurrentlyOpen}>
        <Content>
          {openingHours.map((openingHours, index) => (
            <OpeningEntry
              key={weekdays[index]}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              weekday={t(weekdays[index]!.toLowerCase())}
              openingHours={openingHours}
              isCurrentDay={index === DateTime.now().weekday - 1}
              appointmentUrl={appointmentUrl}
            />
          ))}
        </Content>
      </Collapsible>
      {AppointmentLink}
    </>
  )
}

export default React.memo(OpeningHours)
