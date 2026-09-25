import shouldForwardProp from '@emotion/is-prop-valid'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { PopoverContentProps } from '@reactour/tour'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { TOUR_POPOVER_MAX_WIDTH } from '../constants/tour'
import useLocalStorage, { TOUR_VISIBLE_STORAGE_KEY } from '../hooks/useLocalStorage'
import useLockedBody from '../hooks/useLockedBody'
import { TourStepType } from '../utils/tourSteps'
import { DirectionDependentBackIcon } from './base/Dialog'
import PopoverPaper from './base/PopoverPaper'

const DOT_SIZE = 8

const DirectionDependentForwardIcon = styled(ArrowForwardIcon)(({ theme }) => ({
  transform: theme.direction === 'rtl' ? 'scaleX(-1)' : 'none',
}))

const StyledPaper = styled(PopoverPaper)(({ theme }) => ({
  maxWidth: TOUR_POPOVER_MAX_WIDTH,
  filter: `drop-shadow(1px 0 0 ${theme.palette.common.white}) drop-shadow(-1px 0 0 ${theme.palette.common.white}) drop-shadow(0 1px 0 ${theme.palette.common.white}) drop-shadow(0 -1px 0 ${theme.palette.common.white})`,
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
  useLockedBody(true)

  const step = (steps as TourStepType[])[currentStep]
  const isFirstStep = currentStep === 0

  const closeTour = () => {
    setTourVisible(false)
    setIsOpen(false)
  }

  if (!step) {
    return null
  }

  return (
    <StyledPaper
      elevation={0}
      arrowPosition={step.position}
      arrowAlignment={step.arrowAlignment ?? 'left'}
      offset={step.offset}>
      <Stack sx={{ padding: 2, gap: 2 }}>
        <CloseButton onClick={closeTour} size='small' aria-label={t($ => $.common.actions.close)}>
          <CloseIcon fontSize='small' />
        </CloseButton>
        {step.content}
        <Stack direction='row' sx={{ alignItems: 'center', gap: 1 }}>
          <Typography
            variant='body3'
            aria-label={t($ => $.tour.progress, { current: currentStep + 1, total: steps.length })}>
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
    </StyledPaper>
  )
}

export default TourPopover
