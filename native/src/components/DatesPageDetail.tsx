import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { MAX_DATE_RECURRENCES } from 'shared'
import { DateModel } from 'shared/api'

import PageDetail from './PageDetail'
import Icon from './base/Icon'
import Text from './base/Text'

const SingleDateContainer = styled.View`
  margin-bottom: 8px;
`

const styles = StyleSheet.create({
  TouchableRippleStyle: {
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 4,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
})

type DatesPageDetailProps = {
  date: DateModel
  languageCode: string
}

const DatesPageDetail = ({ date, languageCode }: DatesPageDetailProps): ReactElement | null => {
  const [tapsOnShowMore, setTapsOnShowMore] = useState(0)
  const theme = useTheme()
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
          <TouchableRipple
            borderless
            style={[styles.TouchableRippleStyle, { borderColor: theme.colors.secondary }]}
            role='button'
            onPress={() => setTapsOnShowMore(tapsOnShowMore + 1)}>
            <>
              <Icon size={16} source='filter-variant' />
              <Text>{translateIntoContentLanguage('common:showMore')}</Text>
            </>
          </TouchableRipple>
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
