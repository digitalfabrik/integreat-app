import moment from 'moment'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { OpeningHoursModel } from 'api-client'
import { UiDirectionType } from 'translations/src'

import Collapsible from './Collapsible'
import OpeningEntry from './OpeningEntry'

const OpeningLabel = styled.span<{ isOpened: boolean }>`
  color: ${props => (props.isOpened ? props.theme.colors.positiveHighlight : props.theme.colors.negativeHighlight)};
  margin: 0 auto;
`

const Content = styled.div`
  padding: 8px;
  font-size: clamp(0.55rem, 1.6vh, 0.85rem);
`

const TitleContainer = styled.div`
  display: flex;
  flex: 1;
  font-weight: 700;
  font-size: clamp(0.55rem, 1.6vh, ${props => props.theme.fonts.hintFontSize});
`

type OpeningHoursProps = {
  isCurrentlyOpened: boolean
  direction: UiDirectionType
  openingHours: OpeningHoursModel[] | null
  isTemporarilyClosed: boolean
}

const getOpeningLabel = (isTemporarilyClosed: boolean, isCurrentlyOpened: boolean): string => {
  if (isTemporarilyClosed) {
    return 'openingHoursTemporarilyClosed'
  }
  if (isCurrentlyOpened) {
    return 'openingHoursOpened'
  }
  return 'openingHoursClosed'
}

const OpeningHours = ({
  isCurrentlyOpened,
  direction,
  openingHours,
  isTemporarilyClosed,
}: OpeningHoursProps): ReactElement | null => {
  const { t } = useTranslation('pois')
  moment.locale('de')
  const weekdays = moment.weekdays(true)

  const OpeningHoursTitle = (
    <>
      <span>{t('openingHours')}</span>
      <OpeningLabel isOpened={isCurrentlyOpened}>
        {`${t(getOpeningLabel(isTemporarilyClosed, isCurrentlyOpened))}`}
      </OpeningLabel>
    </>
  )
  if (!openingHours) {
    if (isTemporarilyClosed) {
      return <TitleContainer>{OpeningHoursTitle}</TitleContainer>
    }
    return null
  }

  return (
    <Collapsible title={OpeningHoursTitle} initialCollapsed={false} direction={direction}>
      <Content>
        {openingHours.map((entry, index) => (
          <OpeningEntry
            key={`${weekdays[index]!}-OpeningEntry`}
            weekday={weekdays[index]!}
            allDay={entry.allDay}
            closed={entry.closed}
            timeSlots={entry.timeSlots}
            isCurrentDay={index === moment().isoWeekday() - 1}
          />
        ))}
      </Content>
    </Collapsible>
  )
}

export default OpeningHours
