import { DateTime } from 'luxon'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { Button, TouchableRipple } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { HORIZONTAL_TEXT_DIVIDER, MAX_FURTHER_DATES, MAX_FURTHER_DATES_MOBILE, MORE_INDICATOR } from 'shared'
import { EventModel } from 'shared/api'

import { contentAlignment, contentDirection } from '../constants/contentDirection'
import Icon, { DEFAULT_ICON_SIZE, SMALL_ICON_SIZE } from './base/Icon'
import Text from './base/Text'

const DateRow = styled.View<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
  align-items: flex-start;
  gap: 4px;
`

const InlineWrap = styled.View<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
`

const Toggle = styled(TouchableRipple)<{ language: string }>`
  padding-block: 8px;
`

const Dates = styled.View<{ language: string }>`
  padding-${props => contentAlignment(props.language)}: 24px;
  gap: 8px;
`

const ShowMoreButton = styled(Button)<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
`

type EventDatesProps = {
  event: EventModel
  language: string
  filterStartDate?: DateTime | null
  filterEndDate?: DateTime | null
  compact?: boolean
}

const EventDates = ({
  event,
  language,
  filterStartDate = null,
  filterEndDate = null,
  compact = false,
}: EventDatesProps): ReactElement => {
  const [expansionCount, setExpansionCount] = useState(compact ? 0 : 1)
  const { t } = useTranslation(['events', 'common', 'places'], { lng: language })
  const theme = useTheme()

  const allDayLabel = t($ => $.places.allDay)
  const date = event.date.firstRecurrenceInRange(filterStartDate, filterEndDate)
  const timeInterval = date.formatTimeInterval(language, { allDayLabel })

  const maxFurtherDates = compact ? MAX_FURTHER_DATES_MOBILE : MAX_FURTHER_DATES
  const maxVisibleRecurrences = expansionCount * maxFurtherDates
  const recurrences = date.recurrences(maxVisibleRecurrences + 1).filter(recurrence => !recurrence.isEqual(date))
  const hasRecurrences = date.hasMoreRecurrencesThan(1)
  const hasMoreRecurrences = date.hasMoreRecurrencesThan(maxVisibleRecurrences + 1)
  const expanded = expansionCount > 0

  const textVariant = compact ? 'body3' : 'body2'
  const iconSize = compact ? SMALL_ICON_SIZE : DEFAULT_ICON_SIZE

  return (
    <View>
      <DateRow language={language}>
        <Icon source='calendar-text-outline' size={iconSize} />
        <InlineWrap language={language} style={{ flex: 1 }}>
          <Text variant={textVariant}>{date.formatDateInterval(language)}</Text>
          <Text variant={textVariant} aria-hidden>
            {HORIZONTAL_TEXT_DIVIDER}
          </Text>
          <Text variant={textVariant}>{timeInterval}</Text>
        </InlineWrap>
      </DateRow>
      {hasRecurrences && (
        <>
          <Toggle
            language={language}
            borderless
            accessibilityRole='button'
            accessibilityState={{ expanded }}
            onPress={() => setExpansionCount(previous => (previous > 0 ? 0 : 1))}>
            <InlineWrap language={language}>
              <Icon source='repeat' size={iconSize} color={theme.colors.primary} />
              <Text variant={textVariant} style={{ color: theme.colors.primary }}>
                {t($ => $.furtherDates)}
              </Text>
              <Icon source={expanded ? 'chevron-up' : 'chevron-down'} color={theme.colors.primary} />
            </InlineWrap>
          </Toggle>
          {expanded && (
            <Dates language={language}>
              {recurrences.map((recurrence, index) => {
                const recurrenceTimeInterval = recurrence.formatTimeInterval(language, { allDayLabel })
                return (
                  <InlineWrap key={recurrence.startDate.toISO()} language={language}>
                    <Text variant={textVariant}>{recurrence.formatDateInterval(language)}</Text>
                    {recurrenceTimeInterval !== timeInterval && (
                      <>
                        <Text variant={textVariant} aria-hidden>
                          {HORIZONTAL_TEXT_DIVIDER}
                        </Text>
                        <Text variant={textVariant}>{recurrenceTimeInterval}</Text>
                      </>
                    )}
                    {index === recurrences.length - 1 && hasMoreRecurrences && (
                      <Text variant={textVariant}>{MORE_INDICATOR}</Text>
                    )}
                  </InlineWrap>
                )
              })}
              {hasMoreRecurrences && !compact && (
                <ShowMoreButton
                  icon='chevron-down'
                  onPress={() => setExpansionCount(expansionCount + 1)}
                  language={language}
                  compact>
                  {t($ => $.common.showMore)}
                </ShowMoreButton>
              )}
            </Dates>
          )}
        </>
      )}
    </View>
  )
}

export default EventDates
