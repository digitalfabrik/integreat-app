import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { CSSObject, styled } from '@mui/material/styles'
import { PopoverContentProps, Position } from '@reactour/tour'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { TOUR_POPOVER_MAX_WIDTH } from '../constants/tour'
import useLocalStorage, { TOUR_DIALOG_VISIBLE_STORAGE_KEY } from '../hooks/useLocalStorage'
import useLockedBody from '../hooks/useLockedBody'
import { ArrowAlignment, TourStepType } from './TourStepContent'
import { DirectionDependentBackIcon } from './base/Dialog'

const BORDER_RADIUS = 12
const ARROW_SIZE = 12
const ARROW_OFFSET = 24
const DOT_SIZE = 8

const ARROW_UP = 'polygon(0 100%, 50% 0, 100% 100%)'
const ARROW_DOWN = 'polygon(0 0, 50% 100%, 100% 0)'
const ARROW_LEFT = 'polygon(100% 0, 0 50%, 100% 100%)'
const ARROW_RIGHT = 'polygon(0 0, 100% 50%, 0 100%)'

const inlineInset = (side: ArrowAlignment, inset: number, rtl: boolean): CSSObject =>
  (side === 'left') !== rtl ? { insetInlineStart: inset } : { insetInlineEnd: inset }

const arrowStyle = (position: Position | undefined, alignment: ArrowAlignment, rtl: boolean): CSSObject => {
  switch (position) {
    case 'top':
      return { insetBlockEnd: -ARROW_SIZE, ...inlineInset(alignment, ARROW_OFFSET, rtl), clipPath: ARROW_DOWN }
    case 'right':
      return { insetBlockStart: ARROW_OFFSET, ...inlineInset('left', -ARROW_SIZE, rtl), clipPath: ARROW_LEFT }
    case 'left':
      return { insetBlockStart: ARROW_OFFSET, ...inlineInset('right', -ARROW_SIZE, rtl), clipPath: ARROW_RIGHT }
    default:
      return { insetBlockStart: -ARROW_SIZE, ...inlineInset(alignment, ARROW_OFFSET, rtl), clipPath: ARROW_UP }
  }
}

const DirectionDependentForwardIcon = styled(ArrowForwardIcon)(({ theme }) => ({
  transform: theme.direction === 'rtl' ? 'scaleX(-1)' : 'none',
}))

type StyledPaperProps = {
  arrowPosition: Position | undefined
  arrowAlignment: ArrowAlignment
  offset: TourStepType['offset']
}

const StyledPaper = styled(Paper, {
  shouldForwardProp: prop => prop !== 'arrowPosition' && prop !== 'arrowAlignment' && prop !== 'offset',
})<StyledPaperProps>(({ theme, arrowPosition, arrowAlignment, offset }) => ({
  maxWidth: TOUR_POPOVER_MAX_WIDTH,
  borderRadius: BORDER_RADIUS,
  filter: `drop-shadow(1px 0 0 ${theme.palette.common.white}) drop-shadow(-1px 0 0 ${theme.palette.common.white}) drop-shadow(0 1px 0 ${theme.palette.common.white}) drop-shadow(0 -1px 0 ${theme.palette.common.white})`,
  marginInlineStart: offset?.horizontal,
  marginBlockStart: offset?.vertical,

  '&::before': {
    content: '""',
    position: 'absolute',
    width: ARROW_SIZE,
    height: ARROW_SIZE,
    background: 'inherit',
    ...arrowStyle(arrowPosition, arrowAlignment, theme.contentDirection === 'rtl'),
  },
}))

const Dot = styled('span', { shouldForwardProp: prop => prop !== 'current' })<{ current: boolean }>(
  ({ theme, current }) => ({
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: '50%',
    backgroundColor: current ? theme.palette.primary.main : theme.palette.action.disabled,
  }),
)

const TourPopover = ({ steps, currentStep, setCurrentStep, setIsOpen }: PopoverContentProps): ReactElement | null => {
  const { t } = useTranslation('tour')
  const [, setDialogVisible] = useLocalStorage<boolean>({
    key: TOUR_DIALOG_VISIBLE_STORAGE_KEY,
    initialValue: true,
  })
  useLockedBody(true)

  const step = (steps as TourStepType[])[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  const closeTour = () => {
    setDialogVisible(false)
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
      <Stack padding={2} gap={2}>
        <Stack direction='row' alignItems='flex-start' gap={1}>
          <Stack flex={1}>{step.content}</Stack>
          <IconButton onClick={closeTour} size='small' aria-label={t('common:close')}>
            <CloseIcon fontSize='small' />
          </IconButton>
        </Stack>
        <Stack direction='row' alignItems='center' gap={1}>
          <Typography variant='body3' aria-label={t('progress', { current: currentStep + 1, total: steps.length })}>
            <Typography component='span' variant='body3' color='primary'>
              {currentStep + 1}
            </Typography>
            {`/${steps.length}`}
          </Typography>
          <Stack direction='row' gap={1} aria-hidden>
            {steps.map((step, index) => (
              <Dot key={String(step.selector.toString() + index)} current={index === currentStep} />
            ))}
          </Stack>
        </Stack>
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
          <Button
            size='small'
            disabled={isFirstStep}
            onClick={() => setCurrentStep(currentStep - 1)}
            startIcon={<DirectionDependentBackIcon fontSize='small' />}>
            {t('layout:previous')}
          </Button>
          <Button
            size='small'
            onClick={() => setCurrentStep(currentStep + 1)}
            endIcon={<DirectionDependentForwardIcon fontSize='small' />}>
            {t(isLastStep ? 'finish' : 'layout:next')}
          </Button>
        </Stack>
      </Stack>
    </StyledPaper>
  )
}

export default TourPopover
