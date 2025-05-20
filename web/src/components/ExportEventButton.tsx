import styled from '@emotion/styled'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { EventModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import useWindowDimensions from '../hooks/useWindowDimensions'
import RadioGroup from './base/RadioGroup'
import TextButton from './base/TextButton'

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;

  @media ${dimensions.smallViewport} {
    flex-direction: column;
  }
`

const CancelButton = styled(TextButton)<{ $fullWidth: boolean }>`
  ${props => props.$fullWidth && 'width: 100%;'}
  background-color: ${props => props.theme.colors.textDecorationColor};
  margin: 0;
`

const StyledButton = styled(TextButton)<{ $fullWidth: boolean }>`
  ${props => props.$fullWidth && 'width: 100%;'}
  margin: 0;
`

type ExportEventButtonProps = {
  event: EventModel
}

const ExportEventButton = ({ event }: ExportEventButtonProps): ReactElement => {
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const [exportRecurring, setExportRecurring] = useState<boolean>(false)
  const { t } = useTranslation('events')
  const { viewportSmall } = useWindowDimensions()

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
        <CancelButton onClick={() => setIsExporting(false)} text={t('layout:cancel')} $fullWidth={viewportSmall} />
        <StyledButton
          onClick={() => {
            downloadEventAsIcsFile(event, exportRecurring)
            setExportRecurring(false)
            setIsExporting(false)
          }}
          text={t('exportAsICal')}
          $fullWidth={viewportSmall}
        />
      </ButtonContainer>
    </>
  ) : (
    <StyledButton
      onClick={() => (isRecurring ? setIsExporting(true) : downloadEventAsIcsFile(event, false))}
      text={t('exportAsICal')}
      $fullWidth={viewportSmall}
    />
  )
}

export default ExportEventButton
