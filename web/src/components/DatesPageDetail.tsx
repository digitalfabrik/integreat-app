import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { MAX_DATE_RECURRENCES, MAX_DATE_RECURRENCES_COLLAPSED } from 'shared'
import { DateModel } from 'shared/api'

import useWindowDimensions from '../hooks/useWindowDimensions'
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
  const { viewportSmall } = useWindowDimensions()
  const dates = date.recurrences(MAX_DATE_RECURRENCES).map(it => it.toFormattedString(languageCode, viewportSmall))
  const nextDate = dates[0] ?? date.toFormattedString(languageCode, viewportSmall)
  const hasMoreDates = date.hasMoreRecurrencesThan(MAX_DATE_RECURRENCES)
  const { t } = useTranslation('events')

  if (dates.length === 1) {
    return <PageDetail identifier={t('date_one')} information={nextDate} />
  }

  const Title = <Identifier>{t(hasMoreDates ? 'nextDate_other' : 'date_other')}: </Identifier>
  const Dates = dates.map(it => <div key={it}>{it}</div>)
  const AlwaysShownDates = <>{Dates.slice(0, MAX_DATE_RECURRENCES_COLLAPSED)}</>

  if (dates.length <= MAX_DATE_RECURRENCES_COLLAPSED) {
    return (
      <div>
        {Title}
        {AlwaysShownDates}
      </div>
    )
  }

  return (
    <Collapsible title={Title} Description={AlwaysShownDates} initialCollapsed>
      <>
        {Dates.slice(MAX_DATE_RECURRENCES_COLLAPSED)}
        {hasMoreDates && '...'}
      </>
    </Collapsible>
  )
}

export default DatesPageDetail
