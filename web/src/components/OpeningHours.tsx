import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { OpeningHoursModel, weekdays } from 'api-client'
import { UiDirectionType } from 'translations/src'

import { helpers } from '../constants/theme'
import Collapsible from './Collapsible'
import OpeningEntry from './OpeningEntry'

const OpeningLabel = styled.span<{ isOpened: boolean; direction: string }>`
  color: ${props => (props.isOpened ? props.theme.colors.positiveHighlight : props.theme.colors.negativeHighlight)};
  padding-right: 12px;
  flex: 0;
  ${props => (props.direction === 'rtl' ? `padding-left: 12px;` : `padding-right: 12px;`)}
`

const Content = styled.div<{ direction: UiDirectionType }>`
  ${props => (props.direction === 'rtl' ? `padding-left: 26px;` : `padding-right: 26px;`)}
  ${helpers.adaptiveFontSize};
`

const TitleContainer = styled.div`
  display: flex;
  flex: 1;
  font-weight: 700;
  ${helpers.adaptiveFontSize};
  justify-content: space-between;
  padding-bottom: 8px;
`

type OpeningHoursProps = {
  isCurrentlyOpen: boolean
  direction: UiDirectionType
  openingHours: OpeningHoursModel[] | null
  isTemporarilyClosed: boolean
}

const getOpeningLabel = (isTemporarilyClosed: boolean, isCurrentlyOpened: boolean): string => {
  if (isTemporarilyClosed) {
    return 'temporarilyClosed'
  }
  return isCurrentlyOpened ? 'opened' : 'closed'
}

const OpeningHours = ({
  isCurrentlyOpen,
  direction,
  openingHours,
  isTemporarilyClosed,
}: OpeningHoursProps): ReactElement | null => {
  const { t } = useTranslation('pois')

  const openingHoursTitle = (
    <TitleContainer>
      <span>{t('openingHours')}</span>
      <OpeningLabel isOpened={isCurrentlyOpen} direction={direction}>
        {t(getOpeningLabel(isTemporarilyClosed, isCurrentlyOpen))}
      </OpeningLabel>
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
      <Content direction={direction}>
        {openingHours.map((entry, index) => (
          <OpeningEntry
            key={`${weekdays[index]}-OpeningEntry`}
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            weekday={t(weekdays[index]!.toLowerCase())}
            allDay={entry.allDay}
            closed={entry.closed}
            timeSlots={entry.timeSlots}
            isCurrentDay={index === DateTime.now().weekday - 1}
          />
        ))}
      </Content>
    </Collapsible>
  )
}

export default React.memo(OpeningHours)
