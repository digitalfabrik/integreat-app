import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { MAX_DATE_RECURRENCES, MAX_DATE_RECURRENCES_COLLAPSED } from 'shared'
import { DateModel } from 'shared/api'

import useDimensions from '../hooks/useDimensions'
import PageDetail from './PageDetail'
import Accordion from './base/Accordion'

const Identifier = styled('span')`
  font-weight: bold;
`

type DatesPageDetailProps = {
  date: DateModel
  languageCode: string
}

const DatesPageDetail = ({ date, languageCode }: DatesPageDetailProps): ReactElement | null => {
  const { mobile } = useDimensions()
  const dates = date.recurrences(MAX_DATE_RECURRENCES).map(it => it.toFormattedString(languageCode, mobile))
  const nextDate = dates[0] ?? date.toFormattedString(languageCode, mobile)
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
    <Accordion title={Title} description={AlwaysShownDates} defaultCollapsed>
      <>
        {Dates.slice(MAX_DATE_RECURRENCES_COLLAPSED)}
        {hasMoreDates && '...'}
      </>
    </Accordion>
  )
}

export default DatesPageDetail
