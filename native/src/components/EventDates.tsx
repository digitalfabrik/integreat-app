import { DateTime } from 'luxon'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { HORIZONTAL_TEXT_DIVIDER, MAX_FURTHER_DATES, MAX_FURTHER_DATES_MOBILE, MORE_INDICATOR } from 'shared'
import { EventModel } from 'shared/api'

import { contentDirection } from '../constants/contentDirection'
import Icon, { DEFAULT_ICON_SIZE, SMALL_ICON_SIZE } from './base/Icon'
import Text from './base/Text'

const DateRow = styled.View<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
  align-items: flex-start;
  gap: 4px;
`

const InlineWrap = styled.View<{ language: string }>`
  flex-flow: ${props => contentDirection(props.language)} wrap;
  align-items: center;
  gap: 4px;
`

const Toggle = styled(TouchableRipple)<{ language: string }>`
  padding-block: 8px;
`

const Dates = styled.View`
  padding-inline-start: 24px;
  gap: 8px;
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
  const { t } = useTranslation('events', { lng: language })
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)

  const date = event.date.firstRecurrenceInRange(filterStartDate, filterEndDate)

  const maxFurtherDates = compact ? MAX_FURTHER_DATES_MOBILE : MAX_FURTHER_DATES
  const furtherDates = event.isRecurring ? event.date.furtherDates(maxFurtherDates) : []
  const hasVaryingTimes = event.date.hasVaryingTimes(maxFurtherDates)

  const allDayLabel = t('places:allDay')
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
          <Text variant={textVariant}>{date.formatTimeInterval(language, { allDayLabel })}</Text>
        </InlineWrap>
      </DateRow>
      {furtherDates.length > 0 && (
        <>
          <Toggle
            language={language}
            borderless
            accessibilityRole='button'
            accessibilityState={{ expanded }}
            onPress={() => setExpanded(previous => !previous)}>
            <InlineWrap language={language}>
              <Icon source='repeat' size={iconSize} color={theme.colors.primary} />
              <Text variant={textVariant} style={{ color: theme.colors.primary }}>
                {t('furtherDates')}
              </Text>
              <Icon source={expanded ? 'chevron-up' : 'chevron-down'} color={theme.colors.primary} />
            </InlineWrap>
          </Toggle>
          {expanded && (
            <Dates>
              {furtherDates.map((furtherDate, index) => (
                <InlineWrap key={furtherDate.startDate.toISO()} language={language}>
                  <Text variant={textVariant}>{furtherDate.formatDateInterval(language)}</Text>
                  {hasVaryingTimes && (
                    <>
                      <Text variant={textVariant} aria-hidden>
                        {HORIZONTAL_TEXT_DIVIDER}
                      </Text>
                      <Text variant={textVariant}>{furtherDate.formatTimeInterval(language, { allDayLabel })}</Text>
                    </>
                  )}
                  {index === furtherDates.length - 1 && event.date.hasMoreFurtherDates(maxFurtherDates) && (
                    <Text variant={textVariant}>{MORE_INDICATOR}</Text>
                  )}
                </InlineWrap>
              ))}
            </Dates>
          )}
        </>
      )}
    </View>
  )
}

export default EventDates
