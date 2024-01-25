import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import styled from 'styled-components'

import { MAX_DATE_RECURRENCES, MAX_DATE_RECURRENCES_COLLAPSED } from 'shared'
import { DateModel } from 'shared/api'

import Collapsible from './Collapsible'
import PageDetail from './PageDetail'
import Text from './base/Text'

const Identifier = styled(Text)`
  font-weight: bold;
`

type DatesPageDetailProps = {
  date: DateModel
  languageCode: string
}

const DatesPageDetail = ({ date, languageCode }: DatesPageDetailProps): ReactElement | null => {
  const dates = date.recurrences(MAX_DATE_RECURRENCES).map(it => it.toFormattedString(languageCode, true))
  const nextDate = dates[0] ?? date.toFormattedString(languageCode, true)
  const hasMoreDates = date.hasMoreRecurrencesThan(MAX_DATE_RECURRENCES)
  const { t } = useTranslation('events')

  if (dates.length === 1) {
    return <PageDetail identifier={t('date_one')} information={nextDate} language={languageCode} />
  }

  const Title = <Identifier>{t(hasMoreDates ? 'nextDate_other' : 'date_other')}: </Identifier>
  const Dates = dates.map(it => <Text key={it}>{it}</Text>)
  const AlwaysShownDates = <>{Dates.slice(0, MAX_DATE_RECURRENCES_COLLAPSED)}</>

  if (dates.length <= MAX_DATE_RECURRENCES_COLLAPSED) {
    return (
      <View>
        {Title}
        {AlwaysShownDates}
      </View>
    )
  }

  return (
    <Collapsible headerContent={Title} Description={AlwaysShownDates} language={languageCode} initialCollapsed>
      <>
        {Dates.slice(MAX_DATE_RECURRENCES_COLLAPSED)}
        {hasMoreDates && <Text>...</Text>}
      </>
    </Collapsible>
  )
}

export default DatesPageDetail
