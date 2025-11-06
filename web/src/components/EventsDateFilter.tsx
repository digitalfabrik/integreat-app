import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import FilterListIcon from '@mui/icons-material/FilterList'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { DateTime } from 'luxon'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import DatePicker from './DatePicker'

type EventsDateFilterProps = {
  startDate: DateTime | null
  setStartDate: (startDate: DateTime | null) => void
  startDateError: string | null
  endDate: DateTime | null
  setEndDate: (endDate: DateTime | null) => void
}

const EventsDateFilter = ({
  startDate,
  setStartDate,
  startDateError,
  endDate,
  setEndDate,
}: EventsDateFilterProps): ReactElement => {
  const [showDateFilter, setShowDateFilter] = useState(false)
  const { t } = useTranslation('events')

  const formattedStartDate = startDate?.toFormat('dd.MM.yyyy') ?? '∞'
  const formattedEndDate = endDate?.toFormat('dd.MM.yyyy') ?? '∞'

  return (
    <>
      <Accordion disableGutters expanded={showDateFilter} elevation={0} slotProps={{ heading: { component: 'h2' } }}>
        <AccordionSummary onClick={() => setShowDateFilter(!showDateFilter)} disableRipple>
          <Button component='div' startIcon={showDateFilter ? <CloseFullscreenIcon /> : <FilterListIcon />}>
            {t(showDateFilter ? 'hideFilters' : 'showFilters')}
          </Button>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction='row' justifyContent='space-evenly' alignItems='start' flexWrap='wrap' gap={2}>
            <DatePicker
              title={t('from')}
              date={startDate}
              setDate={setStartDate}
              error={startDateError ? t(startDateError) : undefined}
              calendarLabel={t('selectStartDateCalendar')}
            />
            <DatePicker
              title={t('to')}
              date={endDate}
              setDate={setEndDate}
              calendarLabel={t('selectEndDateCalendar')}
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
      {(startDate || endDate) && (
        <Button
          onClick={() => {
            setStartDate(null)
            setEndDate(null)
          }}
          color='inherit'
          startIcon={<CloseOutlinedIcon />}>
          {`${t('resetFilter')} ${formattedStartDate} - ${formattedEndDate}`}
        </Button>
      )}
    </>
  )
}
export default EventsDateFilter
