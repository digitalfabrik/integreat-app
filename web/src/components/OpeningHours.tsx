import moment from 'moment'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { OpeningHoursModel } from 'api-client'
import { UiDirectionType } from 'translations/src'

import Collapsible from './Collapsible'
import OpeningEntry from './OpeningEntry'

const OpeningLabel = styled.span<{ isOpened: boolean; direction: string }>`
  color: ${props => (props.isOpened ? props.theme.colors.positiveHighlight : props.theme.colors.negativeHighlight)};
  padding-right: 12px;
  ${props => (props.direction === 'rtl' ? `padding-left: 12px;` : `padding-right: 12px;`)}
`

const Content = styled.div`
  font-size: clamp(
    ${props => props.theme.fonts.adaptiveFontSizeSmall.min},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.value},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.max}
  );
`

const TitleContainer = styled.div`
  display: flex;
  flex: 1;
  font-weight: 700;
  font-size: clamp(
    ${props => props.theme.fonts.adaptiveFontSizeSmall.min},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.value},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.max}
  );
  justify-content: space-between;
`

type OpeningHoursProps = {
  isCurrentlyOpen: boolean
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
  isCurrentlyOpen,
  direction,
  openingHours,
  isTemporarilyClosed,
}: OpeningHoursProps): ReactElement | null => {
  const { t } = useTranslation('pois')

  // The opening hours loaded from the cms are ordered according to the german weekday order
  // @ts-expect-error Interface has wrong type, supplying true is necessary and works
  const weekdays = moment.localeData('de').weekdays(true)

  const openingHoursTitle = (
    <>
      <span>{t('openingHours')}</span>
      <OpeningLabel isOpened={isCurrentlyOpen} direction={direction}>
        {t(getOpeningLabel(isTemporarilyClosed, isCurrentlyOpen))}
      </OpeningLabel>
    </>
  )
  if (isTemporarilyClosed) {
    return <TitleContainer>{openingHoursTitle}</TitleContainer>
  }

  if (!openingHours) {
    return null
  }

  return (
    <Collapsible title={openingHoursTitle} direction={direction}>
      <Content>
        {openingHours.map((entry, index) => (
          <OpeningEntry
            key={`${weekdays[index]!}-OpeningEntry`}
            weekday={t(weekdays[index]!.toLowerCase())}
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

export default React.memo(OpeningHours)
