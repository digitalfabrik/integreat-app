import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { MAX_FURTHER_DATES_MOBILE } from 'shared'
import { DateModel } from 'shared/api'

import { contentAlignment, contentDirection } from '../constants/contentDirection'
import Icon from './base/Icon'
import Text from './base/Text'

const Toggle = styled(TouchableRipple)<{ language: string }>`
  align-self: ${props => (contentDirection(props.language) === 'row-reverse' ? 'flex-end' : 'flex-start')};
  padding-block: 8px;
`

const ToggleContent = styled.View<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
  align-items: center;
  gap: 4px;
`

const Dates = styled.View`
  padding-inline-start: 24px;
  gap: 8px;
`

type EventFurtherDatesProps = {
  date: DateModel
  language: string
}

const EventFurtherDates = ({ date, language }: EventFurtherDatesProps): ReactElement | null => {
  const { t } = useTranslation('events', { lng: language })
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)

  const furtherDates = date.furtherDates(MAX_FURTHER_DATES_MOBILE)
  if (furtherDates.length === 0) {
    return null
  }

  const formattedRecurrences = furtherDates.map(recurrence => ({
    key: recurrence.startDate.toISO(),
    ...recurrence.formatMonthlyOrYearlyRecurrence(language, t, true),
  }))
  const firstRecurrenceTime = formattedRecurrences[0]?.time
  const hasVaryingTimes = formattedRecurrences.some(recurrence => recurrence.time !== firstRecurrenceTime)

  return (
    <>
      <Toggle
        language={language}
        borderless
        accessibilityRole='button'
        accessibilityState={{ expanded }}
        onPress={() => setExpanded(previous => !previous)}>
        <ToggleContent language={language}>
          <Icon source='repeat' size={16} color={theme.colors.primary} />
          <Text variant='body3' style={{ color: theme.colors.primary }}>
            {t('furtherDates')}
          </Text>
          <Icon source={expanded ? 'chevron-up' : 'chevron-down'} color={theme.colors.primary} />
        </ToggleContent>
      </Toggle>
      {expanded && (
        <Dates>
          {formattedRecurrences.map(recurrence => (
            <View key={recurrence.key}>
              <Text variant='body3' style={{ textAlign: contentAlignment(language) }}>
                {recurrence.date}
              </Text>
              {hasVaryingTimes && (
                <Text variant='body3' style={{ textAlign: contentAlignment(language) }}>
                  {recurrence.time}
                </Text>
              )}
            </View>
          ))}
          {date.hasMoreFurtherDates(MAX_FURTHER_DATES_MOBILE) && (
            <Text variant='body3' style={{ textAlign: contentAlignment(language) }}>
              …
            </Text>
          )}
        </Dates>
      )}
    </>
  )
}

export default EventFurtherDates
