import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TodayIcon from '@mui/icons-material/TodayOutlined'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import React, { Fragment, ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MAX_DATE_RECURRENCES } from 'shared'
import { DateModel } from 'shared/api'

import PageDetail from './PageDetail'

type DatesPageDetailProps = {
  date: DateModel
  language: string
}

const DatesPageDetail = ({ date, language }: DatesPageDetailProps): ReactElement | null => {
  const [clicksOnShowMore, setClicksOnShowMore] = useState(0)
  const visibleRecurrences = MAX_DATE_RECURRENCES * (clicksOnShowMore + 1)
  const { t } = useTranslation('events')

  const recurrences = date
    .recurrences(visibleRecurrences)
    .map(recurrence => recurrence.formatMonthlyOrYearlyRecurrence(language, t))
    .map(formattedDate => (
      <Fragment key={formattedDate.date}>
        <PageDetail icon={<TodayIcon />} information={formattedDate.date} />
        <PageDetail icon={<AccessTimeIcon />} information={formattedDate.time} />
      </Fragment>
    ))

  if (date.isMonthlyOrYearlyRecurrence()) {
    return (
      <Stack gap={1}>
        {recurrences}
        {date.hasMoreRecurrencesThan(visibleRecurrences) && (
          <Button onClick={() => setClicksOnShowMore(clicksOnShowMore + 1)} startIcon={<ExpandMoreIcon />}>
            {t('common:showMore')}
          </Button>
        )}
      </Stack>
    )
  }

  const formattedDate = date.formatEventDate(language, t)

  return (
    <Stack gap={1}>
      <PageDetail icon={<TodayIcon />} information={formattedDate.date} secondaryInformation={formattedDate.weekday} />
      <PageDetail icon={<AccessTimeIcon />} information={formattedDate.time} />
    </Stack>
  )
}

export default DatesPageDetail
