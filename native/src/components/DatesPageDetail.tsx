import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { MAX_DATE_RECURRENCES } from 'shared'
import { DateModel } from 'shared/api'

import PageDetail from './PageDetail'
import Icon from './base/Icon'
import Pressable from './base/Pressable'
import Text from './base/Text'

const SingleDateContainer = styled.View`
  margin-bottom: 8px;
`

const StyledPressable = styled(Pressable)`
  flex-direction: row;
  gap: 8px;
  border-color: ${props => props.theme.colors.secondary};
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  align-self: flex-start;
  padding: 4px 8px;
`

type DatesPageDetailProps = {
  date: DateModel
  languageCode: string
}

const DatesPageDetail = ({ date, languageCode }: DatesPageDetailProps): ReactElement | null => {
  const [tapsOnShowMore, setTapsOnShowMore] = useState(0)
  const visibleRecurrences = MAX_DATE_RECURRENCES * (tapsOnShowMore + 1)

  // Use the content language to match the surrounding translations
  const { t: translateIntoContentLanguage } = useTranslation('events', { lng: languageCode })

  const recurrences = date
    .recurrences(visibleRecurrences)
    .map(recurrence => recurrence.formatMonthlyOrYearlyRecurrence(languageCode, translateIntoContentLanguage))
    .map(formattedDate => (
      <SingleDateContainer key={formattedDate.date}>
        <PageDetail icon='calendar' information={formattedDate.date} language={languageCode} />
        <PageDetail icon='clock-outline' information={formattedDate.time} language={languageCode} />
      </SingleDateContainer>
    ))

  if (date.isMonthlyOrYearlyRecurrence()) {
    return (
      <View>
        {recurrences}
        {date.hasMoreRecurrencesThan(visibleRecurrences) && (
          <StyledPressable role='button' onPress={() => setTapsOnShowMore(tapsOnShowMore + 1)}>
            <Icon size={16} source='filter-variant' />
            <Text>{translateIntoContentLanguage('common:showMore')}</Text>
          </StyledPressable>
        )}
      </View>
    )
  }

  const formattedDate = date.formatEventDate(languageCode, translateIntoContentLanguage)

  return (
    <View>
      <PageDetail icon='calendar' information={formattedDate.date} language={languageCode} />
      {!!formattedDate.weekday && <PageDetail information={formattedDate.weekday} language={languageCode} />}
      <PageDetail icon='clock-outline' information={formattedDate.time} language={languageCode} />
    </View>
  )
}

export default DatesPageDetail
