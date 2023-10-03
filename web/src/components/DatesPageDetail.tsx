import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { DateModel, MAX_DATE_RECURRENCES, MAX_DATE_RECURRENCES_COLLAPSED } from 'api-client'

import Collapsible from './Collapsible'
import PageDetail from './PageDetail'

const Identifier = styled.span`
  font-weight: bold;
`

type DatesPageDetailProps = {
  date: DateModel
  languageCode: string
}

const DatesPageDetail = ({ date, languageCode }: DatesPageDetailProps): ReactElement | null => {
  const dates = date.recurrences(MAX_DATE_RECURRENCES).map(it => it.toFormattedString(languageCode))
  const nextDate = dates[0] ?? date.toFormattedString(languageCode)
  const hasMoreDates = date.hasMoreRecurrencesThan(MAX_DATE_RECURRENCES)
  const { t } = useTranslation('events')

  if (dates.length === 1) {
    return <PageDetail identifier={t('date_one')} information={nextDate} />
  }

  const Title = <Identifier>{t(hasMoreDates ? 'nextDate_other' : 'date_other')}: </Identifier>
  const Dates = dates.map(it => <div key={it}>{it}</div>)
  const StickyDates = <>{Dates.slice(0, MAX_DATE_RECURRENCES_COLLAPSED)}</>

  if (dates.length <= MAX_DATE_RECURRENCES_COLLAPSED) {
    return (
      <div>
        {Title}
        {StickyDates}
      </div>
    )
  }

  return (
    <Collapsible title={Title} Description={StickyDates} initialCollapsed>
      <>
        {Dates.slice(MAX_DATE_RECURRENCES_COLLAPSED)}
        {hasMoreDates && '...'}
      </>
    </Collapsible>
  )
}

export default DatesPageDetail
