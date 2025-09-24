import { styled } from '@mui/material/styles'
import React, { ReactElement, ReactNode, RefObject, useImperativeHandle, useRef, useState } from 'react'
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'
import { SpringEvent } from 'react-spring-bottom-sheet/dist/types'

import useDimensions from '../hooks/useDimensions'
import { RichLayout } from './Layout'

const Title = styled('h1')`
  font-size: 1.25rem;
  font-family: ${props => props.theme.legacy.fonts.web.contentFont};
`

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
  title?: string
  children: ReactNode
  sibling: ReactNode
  setBottomActionSheetHeight: (height: number) => void
  ref: RefObject<ScrollableBottomSheetRef | null>
}

const BottomActionSheet = ({
  title,
  children,
  sibling,
  setBottomActionSheetHeight,
  ref,
}: BottomActionSheetProps): ReactElement => {
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null)
  const dimensions = useDimensions()
  const bottomSheetRef = useRef<BottomSheetRef>(null)
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

  return (
    <StyledBottomSheet
      ref={bottomSheetRef}
      open
      sibling={sibling}
      scrollLocking={false}
      blocking={false}
      onSpringStart={initializeScrollElement}
      onSpringEnd={() => setBottomActionSheetHeight(bottomSheetRef.current?.height ?? 0)}
      header={title ? <Title>{title}</Title> : null}
      snapPoints={() => dimensions.bottomSheet.snapPoints.all}
      defaultSnap={() => dimensions.bottomSheet.snapPoints.medium}>
      <StyledLayout>{children}</StyledLayout>
    </StyledBottomSheet>
  )
}

export default BottomActionSheet
