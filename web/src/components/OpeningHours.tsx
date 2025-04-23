import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'

import { weekdays } from 'shared'
import { OpeningHoursModel } from 'shared/api'

import { helpers } from '../constants/theme'
import Collapsible from './Collapsible'
import OpeningEntry from './OpeningEntry'
import Spacer from './Spacer'

const OpeningLabel = styled.span<{ $isOpen: boolean }>`
  color: ${props => (props.$isOpen ? props.theme.colors.positiveHighlight : props.theme.colors.negativeHighlight)};
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
  font-weight: 700;
  ${helpers.adaptiveFontSize};
`

const OpeningContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

type OpeningHoursProps = {
  isCurrentlyOpen: boolean
  openingHours: OpeningHoursModel[] | null
  isTemporarilyClosed: boolean
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
  appointmentOverlayLink,
}: OpeningHoursProps): ReactElement | null => {
  const { t } = useTranslation('pois')
  const theme = useTheme()
  const isOnlyWithAppointment = !openingHours && !!appointmentOverlayLink

  const openingHoursTitle = (
    <TitleContainer>
      <span>{t('openingHours')}</span>
      <OpeningContainer>
        <OpeningLabel $isOpen={isCurrentlyOpen}>
          {t(getOpeningLabel(isTemporarilyClosed, isCurrentlyOpen, openingHours))}
        </OpeningLabel>
      </OpeningContainer>
    </TitleContainer>
  )
  if (isTemporarilyClosed || isOnlyWithAppointment) {
    return (
      <>
        <Spacer $borderColor={theme.colors.borderColor} />
        <TitleContainer>{openingHoursTitle}</TitleContainer>
      </>
    )
  }

  if (!openingHours || openingHours.length !== weekdays.length) {
    return null
  }

  return (
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
  )
}

export default React.memo(OpeningHours)
