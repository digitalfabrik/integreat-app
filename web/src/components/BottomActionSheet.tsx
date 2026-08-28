import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import ButtonBase from '@mui/material/ButtonBase'
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

  [data-rsbs-header] {
    padding: 0;
  }

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

const HeaderButton = styled(ButtonBase)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: ${props => props.theme.spacing(1, 2)};
  color: ${props => props.theme.palette.text.primary};
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
  const { t } = useTranslation()
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

  const toggleFullscreen = () => {
    const isFullscreen = (bottomSheetRef.current?.height ?? 0) >= max
    setIsFullscreen(!isFullscreen)
    bottomSheetRef.current?.snapTo(isFullscreen ? medium : max)
  }

  return (
    <StyledBottomSheet
      ref={bottomSheetRef}
      open
      header={
        <HeaderButton
          dir={contentDirection}
          onClick={toggleFullscreen}
          aria-label={t($ => $.common.handle)}
          aria-describedby='title'
          aria-expanded={isFullscreen}>
          <HandleIcon sx={{ alignSelf: 'center', transform: 'scaleX(1.5)' }} />
          {!!title && (
            <Typography id='title' component='h1' variant='h5' sx={{ alignSelf: 'start' }}>
              {title}
            </Typography>
          )}
        </HeaderButton>
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
