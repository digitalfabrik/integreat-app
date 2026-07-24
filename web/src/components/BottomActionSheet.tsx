import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { styled, useTheme } from '@mui/material/styles'
import React, { ReactElement, ReactNode, RefObject, useImperativeHandle, useRef, useState } from 'react'
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
  ref: RefObject<ScrollableBottomSheetRef | null>
}

const BottomActionSheet = ({ children, sibling, ref }: BottomActionSheetProps): ReactElement => {
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const bottomSheetRef = useRef<BottomSheetRef>(null)
  const { dimensions, contentDirection } = useTheme()

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

  const updateFullscreen = () => {
    const { max } = dimensions.bottomSheet.snapPoints
    setIsFullscreen((bottomSheetRef.current?.height ?? 0) >= max)
  }

  const HandleIcon = isFullscreen ? KeyboardArrowDownIcon : KeyboardArrowUpIcon

  return (
    <StyledBottomSheet
      ref={bottomSheetRef}
      open
      header={<HandleIcon sx={{ color: 'text.primary', fontSize: 32 }} />}
      sibling={sibling}
      scrollLocking={false}
      blocking={false}
      onSpringStart={initializeScrollElement}
      onSpringEnd={updateFullscreen}
      snapPoints={() => dimensions.bottomSheet.snapPoints.all}
      defaultSnap={() => dimensions.bottomSheet.snapPoints.medium}>
      <StyledLayout dir={contentDirection}>{children}</StyledLayout>
    </StyledBottomSheet>
  )
}

export default BottomActionSheet
