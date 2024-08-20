import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { weekdays } from 'shared'
import { OpeningHoursModel } from 'shared/api'

import { helpers } from '../constants/theme'
import Collapsible from './Collapsible'
import OpeningEntry from './OpeningEntry'

const OpeningLabel = styled.span<{ $isOpen: boolean }>`
  color: ${props => (props.$isOpen ? props.theme.colors.positiveHighlight : props.theme.colors.negativeHighlight)};
  padding-inline-end: 12px;
  flex: 0;
`

const Content = styled.div`
  padding-inline-end: 26px;
  ${helpers.adaptiveFontSize};
`

const TitleContainer = styled.div`
  display: flex;
  flex: 1;
  font-weight: 700;
  justify-content: space-between;
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

const getOpeningLabel = (isTemporarilyClosed: boolean, isCurrentlyOpened: boolean): string => {
  if (isTemporarilyClosed) {
    return 'temporarilyClosed'
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

  const openingHoursTitle = (
    <TitleContainer>
      <span>{t('openingHours')}</span>
      <OpeningContainer>
        <OpeningLabel $isOpen={isCurrentlyOpen}>
          {t(getOpeningLabel(isTemporarilyClosed, isCurrentlyOpen))}
        </OpeningLabel>
      </OpeningContainer>
    </TitleContainer>
  )
  if (isTemporarilyClosed) {
    return <TitleContainer>{openingHoursTitle}</TitleContainer>
  }

  if (!openingHours || openingHours.length !== weekdays.length) {
    return null
  }

  return (
    <Collapsible title={openingHoursTitle}>
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
