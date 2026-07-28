import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableRipple } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { DateModel } from 'shared/api'

import { contentAlignment, contentDirection } from '../constants/contentDirection'
import Icon from './base/Icon'
import Text from './base/Text'

const MAX_FURTHER_DATES = 6

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
  padding-inline-start: 32px;
`

type EventFurtherDatesProps = {
  date: DateModel
  language: string
}

const EventFurtherDates = ({ date, language }: EventFurtherDatesProps): ReactElement | null => {
  const { t } = useTranslation('events', { lng: language })
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)

  const furtherDates = date.isMonthlyOrYearlyRecurrence() ? date.recurrences(MAX_FURTHER_DATES).slice(1) : []
  if (furtherDates.length === 0) {
    return null
  }
  const hasMoreDates = date.hasMoreRecurrencesThan(MAX_FURTHER_DATES)

  const formatFurtherDate = (recurrence: DateModel): string => {
    const { date: formattedDate, time } = recurrence.formatMonthlyOrYearlyRecurrence(language, t, true)
    return `${formattedDate} · ${time}`
  }

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
          {furtherDates.map((recurrence, index) => {
            const isLast = index === furtherDates.length - 1
            const formattedDate = formatFurtherDate(recurrence)
            return (
              <Text
                key={recurrence.startDate.toISO()}
                variant='body3'
                style={{ textAlign: contentAlignment(language) }}>
                {isLast && hasMoreDates ? `${formattedDate} …` : formattedDate}
              </Text>
            )
          })}
        </Dates>
      )}
    </>
  )
}

export default EventFurtherDates
