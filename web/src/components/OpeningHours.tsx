import styled from '@emotion/styled'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { weekdays } from 'shared'
import { OpeningHoursModel } from 'shared/api'

import { ExternalLinkIcon } from '../assets'
import { helpers } from '../constants/theme'
import Collapsible from './Collapsible'
import OpeningEntry from './OpeningEntry'
import Icon from './base/Icon'
import Link from './base/Link'

const OpeningLabel = styled.span<{ isOpen: boolean }>`
  color: ${props => (props.isOpen ? props.theme.colors.positiveHighlight : props.theme.colors.negativeHighlight)};
  padding-inline-end: 12px;
`

const Content = styled.div`
  padding-inline-end: 26px;
  ${helpers.adaptiveFontSize};
`

const TitleContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  font-weight: 700;
  ${helpers.adaptiveFontSize};
`

const OpeningContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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

const StyledExternalLinkIcon = styled(Icon)`
  flex-shrink: 0;
  object-fit: contain;
  align-self: center;
  width: 16px;
  height: 16px;
`

type OpeningHoursProps = {
  isCurrentlyOpen: boolean
  openingHours: OpeningHoursModel[] | null
  isTemporarilyClosed: boolean
  appointmentUrl: string | null
  appointmentOverlayLink: string | null
}

const getOpeningLabel = (
  isTemporarilyClosed: boolean,
  isCurrentlyOpened: boolean,
  openingHours: OpeningHoursModel[] | null,
): string => {
  if (isTemporarilyClosed) {
    return 'temporarilyClosed'
  }
  if (!openingHours) {
    return 'onlyWithAppointment'
  }
  return isCurrentlyOpened ? 'opened' : 'closed'
}

const OpeningHours = ({
  isCurrentlyOpen,
  openingHours,
  isTemporarilyClosed,
  appointmentUrl,
  appointmentOverlayLink,
}: OpeningHoursProps): ReactElement | null => {
  const { t } = useTranslation('pois')
  const isOnlyWithAppointment = !openingHours && !!appointmentOverlayLink

  const openingHoursTitle = (
    <TitleContainer>
      <span>{t('openingHours')}</span>
      <OpeningContainer>
        <OpeningLabel isOpen={isCurrentlyOpen}>
          {t(getOpeningLabel(isTemporarilyClosed, isCurrentlyOpen, openingHours))}
        </OpeningLabel>
      </OpeningContainer>
    </TitleContainer>
  )

  const appointmentLink = appointmentUrl ? (
    <StyledLink to={appointmentUrl}>
      <LinkLabel>{t('makeAppointment')}</LinkLabel>
      <StyledExternalLinkIcon src={ExternalLinkIcon} directionDependent />
    </StyledLink>
  ) : null

  if (isTemporarilyClosed || isOnlyWithAppointment) {
    return (
      <>
        <TitleContainer>{openingHoursTitle}</TitleContainer>
        {appointmentLink}
      </>
    )
  }

  if (!openingHours || openingHours.length !== weekdays.length) {
    return null
  }

  return (
    <>
      <Collapsible title={openingHoursTitle} initialCollapsed={!isCurrentlyOpen}>
        <Content>
          {openingHours.map((entry, index) => (
            <OpeningEntry
              key={`${weekdays[index]}-OpeningEntry`}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              weekday={t(weekdays[index]!.toLowerCase())}
              allDay={entry.allDay}
              closed={entry.closed}
              timeSlots={entry.timeSlots}
              isCurrentDay={index === DateTime.now().weekday - 1}
              appointmentOnly={entry.appointmentOnly}
              appointmentOverlayLink={appointmentOverlayLink}
            />
          ))}
        </Content>
      </Collapsible>
      {appointmentLink}
    </>
  )
}

export default React.memo(OpeningHours)
