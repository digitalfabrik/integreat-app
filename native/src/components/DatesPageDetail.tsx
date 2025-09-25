import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { MAX_DATE_RECURRENCES } from 'shared'
import { DateModel } from 'shared/api'

import { CalendarTodayIcon, ClockIcon, ExpandIcon } from '../assets'
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
  border-color: ${props => props.theme.colors.themeColor};
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  align-self: flex-start;
  padding: 4px 8px;
`

const StyledIcon = styled(Icon)`
  width: 16px;
  height: 16px;
`

type DatesPageDetailProps = {
  date: DateModel
  languageCode: string
}

const DatesPageDetail = ({ date, languageCode }: DatesPageDetailProps): ReactElement | null => {
  const [tapsOnShowMore, setTapsOnShowMore] = useState(0)

  // Pass in the content language as opposed to the phone language
  const { t } = useTranslation('events', { lng: languageCode })

  if (date.isMonthlyOrYearlyRecurrence()) {
    return (
      <View>
        {date
          .recurrences(MAX_DATE_RECURRENCES * (tapsOnShowMore + 1))
          .map(recurrence => recurrence.formatMonthlyOrYearlyRecurrence(languageCode, t))
          .map(formattedDate => (
            <SingleDateContainer key={formattedDate.date}>
              <PageDetail Icon={CalendarTodayIcon} information={formattedDate.date} language={languageCode} />
              <PageDetail Icon={ClockIcon} information={formattedDate.time} language={languageCode} />
            </SingleDateContainer>
          ))}
        {date.hasMoreRecurrencesThan(MAX_DATE_RECURRENCES * (tapsOnShowMore + 1)) && (
          <StyledPressable role='button' onPress={() => setTapsOnShowMore(tapsOnShowMore + 1)}>
            <StyledIcon Icon={ExpandIcon} />
            <Text>{t('common:showMore')}</Text>
          </StyledPressable>
        )}
      </View>
    )
  }

  const formattedDate = date.formatEventDate(languageCode, t)

  return (
    <View>
      <PageDetail Icon={CalendarTodayIcon} information={formattedDate.date} language={languageCode} />
      {!!formattedDate.weekday && <PageDetail information={formattedDate.weekday} language={languageCode} />}
      <PageDetail Icon={ClockIcon} information={formattedDate.time} language={languageCode} />
    </View>
  )
}

export default DatesPageDetail
