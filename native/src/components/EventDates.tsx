import { DateTime } from 'luxon'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import {
  firstDateInRange,
  HORIZONTAL_TEXT_DIVIDER,
  MAX_FURTHER_DATES,
  MAX_FURTHER_DATES_MOBILE,
  MORE_INDICATOR,
} from 'shared'
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
  size?: 'small' | 'medium'
}

const EventDates = ({
  event,
  language,
  filterStartDate = null,
  filterEndDate = null,
  size = 'medium',
}: EventDatesProps): ReactElement => {
  const { t } = useTranslation('events', { lng: language })
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)

  const date = firstDateInRange(event, filterStartDate, filterEndDate)

  const maxFurtherDates = size === 'medium' ? MAX_FURTHER_DATES : MAX_FURTHER_DATES_MOBILE
  const furtherDates = event.isRecurring ? event.date.furtherDates(maxFurtherDates) : []
  const hasVaryingTimes = event.date.hasVaryingTimes(maxFurtherDates)

  const allDayLabel = t('places:allDay')
  const textVariant = size === 'medium' ? 'body2' : 'body3'
  const iconSize = size === 'medium' ? DEFAULT_ICON_SIZE : SMALL_ICON_SIZE

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
