import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import MuiDialog, { dialogClasses } from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { useTour } from '@reactour/tour'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import buildConfig from '../constants/buildConfig'
import { LAYOUT_ELEMENT_ID } from '../constants/layout'
import useLocalStorage, { TOUR_DIALOG_VISIBLE_STORAGE_KEY } from '../hooks/useLocalStorage'
import Svg from './base/Svg'

const LOGO_SIZE = 48
const DIALOG_WIDTH = 320
const TITLE_ELEMENT_ID = 'tour-dialog-title'
const DESCRIPTION_ELEMENT_ID = 'tour-dialog-description'

const StyledMuiDialog = styled(MuiDialog)(({ theme }) => ({
  [`.${dialogClasses.paper}`]: {
    overflow: 'visible',
    [theme.breakpoints.up('md')]: {
      width: DIALOG_WIDTH,
    },
  },
}))

const StyledSvg = styled(Svg)`
  position: absolute;
  top: -24px;
  left: calc(50% - ${LOGO_SIZE / 2}px);
  border-radius: 50%;
  overflow: hidden;

  /* Prevent the inline svg from adding space below the baseline */
  & svg {
    display: block;
  }
`

const TourDialog = (): ReactElement | null => {
  const { t } = useTranslation('tour')
  const { isOpen, setIsOpen, currentStep, setCurrentStep, steps } = useTour()
  const [welcomeVisible, setWelcomeVisible] = useLocalStorage<boolean>({
    key: TOUR_DIALOG_VISIBLE_STORAGE_KEY,
    initialValue: true,
  })
  const [started, setStarted] = useState(false)
  const { appName, icons } = buildConfig()

  // This is necessary to ensure the theme is correctly applied to the dialog content
  const dialogContainer = document.getElementById(LAYOUT_ELEMENT_ID)

  const finishTour = () => {
    setWelcomeVisible(false)
    setIsOpen(false)
    setCurrentStep(0)
  }
  const startTour = () => {
    window.scrollTo({ top: 0 })
    setStarted(true)
    setIsOpen(true)
  }

  const finished = isOpen && currentStep >= steps.length
  const content = finished
    ? {
        title: t('finishTitle'),
        description: t('finishDescription', { appName }),
        actionText: t('finishAction'),
        action: finishTour,
        close: finishTour,
        showSkipButton: false,
      }
    : {
        title: t('intro:welcome', { appName }),
        description: t('welcomeDescription'),
        actionText: t('startTour'),
        action: startTour,
        close: () => setWelcomeVisible(false),
        showSkipButton: true,
      }

  if (!finished && (!welcomeVisible || started)) {
    return null
  }

  return (
    <StyledMuiDialog
      onClose={content.close}
      container={dialogContainer}
      aria-labelledby={TITLE_ELEMENT_ID}
      aria-describedby={DESCRIPTION_ELEMENT_ID}
      open>
      <StyledSvg src={icons.appLogoMobile} width={LOGO_SIZE} height={LOGO_SIZE} />
      <Stack sx={{ alignItems: 'flex-end', marginInline: 1, marginBlockStart: 1 }}>
        <IconButton onClick={content.close} size='small' aria-label={t('common:close')}>
          <CloseIcon fontSize='small' />
        </IconButton>
      </Stack>
      <DialogContent sx={{ paddingBlockStart: 0 }}>
        <Stack sx={{ alignItems: 'center', textAlign: 'center', gap: 2 }}>
          <Typography id={TITLE_ELEMENT_ID} component='h2' variant='h3'>
            {content.title}
          </Typography>
          <Typography id={DESCRIPTION_ELEMENT_ID} variant='body2'>
            {content.description}
          </Typography>
          <Button onClick={content.action} variant='contained' fullWidth>
            {content.actionText}
          </Button>
          {content.showSkipButton && <Button onClick={content.close}>{t('skipTour')}</Button>}
        </Stack>
      </DialogContent>
    </StyledMuiDialog>
  )
}

export default TourDialog
