import shouldForwardProp from '@emotion/is-prop-valid'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { PopoverContentProps } from '@reactour/tour'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TOUR_POPOVER_MAX_WIDTH } from '../constants/tour'
import useLocalStorage, { TOUR_VISIBLE_STORAGE_KEY } from '../hooks/useLocalStorage'
import useLockedBody from '../hooks/useLockedBody'
import { TourStepType } from '../utils/tourSteps'
import LiveAnnouncer from './LiveAnnouncer'
import { DirectionDependentBackIcon } from './base/Dialog'
import PopoverPaper from './base/PopoverPaper'

const DOT_SIZE = 8
const CONTENT_ELEMENT_ID = 'tour-popover-content'

const DirectionDependentForwardIcon = styled(ArrowForwardIcon)(({ theme }) => ({
  transform: theme.direction === 'rtl' ? 'scaleX(-1)' : 'none',
}))

const StyledPaper = styled(PopoverPaper)(({ theme }) => ({
  maxWidth: TOUR_POPOVER_MAX_WIDTH,
  filter: `drop-shadow(1px 0 0 ${theme.palette.common.white}) drop-shadow(-1px 0 0 ${theme.palette.common.white}) drop-shadow(0 1px 0 ${theme.palette.common.white}) drop-shadow(0 -1px 0 ${theme.palette.common.white})`,
  // The popover itself is only focused programmatically for screen readers and is not interactive
  outline: 'none',
}))

const Dot = styled('span', { shouldForwardProp })<{ current: boolean }>(({ theme, current }) => {
  const inactiveColor = theme.isContrastTheme ? theme.palette.text.disabled : theme.palette.action.disabled
  return {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: '50%',
    backgroundColor: current ? theme.palette.primary.main : inactiveColor,
  }
})

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  insetBlockStart: theme.spacing(1),
  insetInlineEnd: theme.spacing(1),
}))

const TourPopover = ({ steps, currentStep, setCurrentStep, setIsOpen }: PopoverContentProps): ReactElement | null => {
  const { t } = useTranslation()
  const [, setTourVisible] = useLocalStorage<boolean>({
    key: TOUR_VISIBLE_STORAGE_KEY,
    initialValue: true,
  })
  const [announcement, setAnnouncement] = useState('')
  const paperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const previousStepRef = useRef<number | null>(null)
  useLockedBody(true)

  const step = (steps as TourStepType[])[currentStep]
  const isFirstStep = currentStep === 0
  const progress = t($ => $.tour.progress, { current: currentStep + 1, total: steps.length })

  useEffect(() => {
    const paper = paperRef.current
    if (!paper) {
      return
    }
    const isInitialStep = previousStepRef.current === null
    previousStepRef.current = currentStep
    // Moving the focus into the popover makes screen readers read out the dialog, including the first step
    // Afterwards the focus stays on the navigation buttons, so the content of the following steps is announced instead
    if (isInitialStep || !paper.contains(document.activeElement)) {
      paper.focus({ preventScroll: true })
    }
    if (!isInitialStep) {
      setAnnouncement(`${progress}: ${contentRef.current?.textContent ?? ''}`)
    }
    // The announcement should only be updated if the step changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep])

  const closeTour = () => {
    setTourVisible(false)
    setIsOpen(false)
  }

  if (!step) {
    return null
  }

  return (
    <StyledPaper
      ref={paperRef}
      role='dialog'
      aria-label={t($ => $.tour.title)}
      aria-describedby={CONTENT_ELEMENT_ID}
      tabIndex={-1}
      elevation={0}
      arrowPosition={step.position}
      arrowAlignment={step.arrowAlignment ?? 'left'}
      offset={step.offset}>
      <Stack sx={{ padding: 2, gap: 2 }}>
        <CloseButton onClick={closeTour} size='small' aria-label={t($ => $.common.actions.close)}>
          <CloseIcon fontSize='small' />
        </CloseButton>
        <div id={CONTENT_ELEMENT_ID} ref={contentRef}>
          {step.content}
        </div>
        <Stack direction='row' sx={{ alignItems: 'center', gap: 1 }}>
          <Typography variant='body3' aria-label={progress}>
            <Typography component='span' variant='body3' color='textPrimary'>
              {currentStep + 1}
            </Typography>
            <Typography component='span' variant='body3' color='textDisabled'>
              {`/${steps.length}`}
            </Typography>
          </Typography>
          <Stack direction='row' sx={{ gap: 1 }} aria-hidden>
            {steps.map((step, index) => (
              <Dot key={step.selector.toString()} current={index === currentStep} />
            ))}
          </Stack>
        </Stack>
        <Stack
          direction='row'
          sx={{ alignItems: 'center', justifyContent: isFirstStep ? 'flex-end' : 'space-between' }}>
          {!isFirstStep && (
            <Button
              size='small'
              onClick={() => setCurrentStep(currentStep - 1)}
              startIcon={<DirectionDependentBackIcon fontSize='small' />}>
              {t($ => $.common.actions.previous)}
            </Button>
          )}
          <Button
            size='small'
            onClick={() => setCurrentStep(currentStep + 1)}
            endIcon={<DirectionDependentForwardIcon fontSize='small' />}>
            {t($ => $.common.actions.next)}
          </Button>
        </Stack>
      </Stack>
      <LiveAnnouncer message={announcement} />
    </StyledPaper>
  )
}

export default TourPopover
