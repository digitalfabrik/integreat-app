import styled from '@emotion/styled'
import DownloadIcon from '@mui/icons-material/Download'
import Button from '@mui/material/Button'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { EventModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import RadioGroup from './base/RadioGroup'

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
`

type ExportEventButtonProps = {
  event: EventModel
}

const ExportEventButton = ({ event }: ExportEventButtonProps): ReactElement => {
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const [exportRecurring, setExportRecurring] = useState<boolean>(false)
  const { t } = useTranslation('events')

  const isRecurring = event.date.hasMoreRecurrencesThan(1)

  const downloadEventAsIcsFile = (event: EventModel, recurring: boolean) => {
    const blob = new Blob([event.toICal(window.location.origin, buildConfig().appName, recurring)], {
      type: 'text/calendar;charset=utf-8',
    })
    const anchorElement = document.createElement('a')
    anchorElement.href = window.URL.createObjectURL(blob)
    anchorElement.setAttribute('download', `${event.title}.ics`)
    document.body.appendChild(anchorElement)
    anchorElement.click()
    document.body.removeChild(anchorElement)
  }

  return isExporting && isRecurring ? (
    <>
      <RadioGroup
        caption={t('addToCalendar')}
        groupId='recurring'
        selectedValue={exportRecurring ? 'recurring' : 'one'}
        onChange={value => {
          setExportRecurring(value === 'recurring')
        }}
        values={[
          { key: 'one', label: t('onlyThisEvent') },
          { key: 'recurring', label: t('thisAndAllFutureEvents') },
        ]}
      />
      <ButtonContainer>
        <Button onClick={() => setIsExporting(false)}>{t('layout:cancel')}</Button>
        <Button
          onClick={() => {
            downloadEventAsIcsFile(event, exportRecurring)
            setExportRecurring(false)
            setIsExporting(false)
          }}
          variant='outlined'
          startIcon={<DownloadIcon />}>
          {t('export')}
        </Button>
      </ButtonContainer>
    </>
  ) : (
    <Button
      onClick={() => (isRecurring ? setIsExporting(true) : downloadEventAsIcsFile(event, false))}
      startIcon={<DownloadIcon />}>
      {t('export')}
    </Button>
  )
}

export default ExportEventButton
