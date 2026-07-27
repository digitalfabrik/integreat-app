import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import React, { ReactElement, ReactNode, RefObject, useImperativeHandle, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'
import { SpringEvent } from 'react-spring-bottom-sheet/dist/types'

import { RichLayout } from './Layout'

const StyledBottomSheet = styled(BottomSheet)`
  direction: ${props => props.theme.contentDirection};

  /* Position bottom sheet above content */
  z-index: 2;

  [data-rsbs-scroll] {
    margin-bottom: ${props => props.theme.dimensions.bottomNavigationHeight ?? 0}px;
  }
`

const StyledLayout = styled(RichLayout)`
  justify-content: flex-start;
  width: 100%;
  min-height: unset;
  padding-bottom: ${props => props.theme.dimensions.ttsPlayerHeight}px;
`

export type ScrollableBottomSheetRef = {
  scrollElement: HTMLElement | null
  sheet?: BottomSheetRef | null
}

type BottomActionSheetProps = {
  children: ReactNode
  sibling: ReactNode
  title?: string
  ref: RefObject<ScrollableBottomSheetRef | null>
}

const BottomActionSheet = ({ children, sibling, title, ref }: BottomActionSheetProps): ReactElement => {
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const bottomSheetRef = useRef<BottomSheetRef>(null)
  const { dimensions, contentDirection } = useTheme()
  const { t } = useTranslation('common')
  const { max, medium } = dimensions.bottomSheet.snapPoints
  const HandleIcon = isFullscreen ? KeyboardArrowDownIcon : KeyboardArrowUpIcon

  useImperativeHandle(
    ref,
    () => ({
      sheet: bottomSheetRef.current,
      scrollElement,
    }),
    [bottomSheetRef, scrollElement],
  )

  const initializeScrollElement = (event: SpringEvent) => {
    if (event.type === 'OPEN' && !scrollElement) {
      const scrollElement = document.querySelector('[data-rsbs-scroll]') as HTMLElement | null
      setScrollElement(scrollElement)
    }
  }

  const updateFullscreen = () => setIsFullscreen((bottomSheetRef.current?.height ?? 0) >= max)

  return (
    <StyledBottomSheet
      ref={bottomSheetRef}
      open
      header={
        <Stack alignItems='flex-start' color='text.primary'>
          <IconButton
            onClick={() => bottomSheetRef.current?.snapTo(isFullscreen ? medium : max)}
            aria-label={t('handle')}
            sx={{ alignSelf: 'stretch', padding: 0, borderRadius: 0, color: 'inherit' }}>
            <HandleIcon sx={{ fontSize: 32, transform: 'scaleX(1.5)' }} />
          </IconButton>
          {!!title && (
            <Typography component='h1' variant='h5'>
              {title}
            </Typography>
          )}
        </Stack>
      }
      sibling={sibling}
      scrollLocking={false}
      blocking={false}
      onSpringStart={initializeScrollElement}
      onSpringEnd={updateFullscreen}
      snapPoints={() => dimensions.bottomSheet.snapPoints.all}
      defaultSnap={() => medium}>
      <StyledLayout dir={contentDirection}>{children}</StyledLayout>
    </StyledBottomSheet>
  )
}

export default BottomActionSheet
