import { styled } from '@mui/material/styles'
import React, { ReactElement, ReactNode, RefObject, useImperativeHandle, useRef, useState } from 'react'
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'
import { SpringEvent } from 'react-spring-bottom-sheet/dist/types'

import useDimensions from '../hooks/useDimensions'
import { getSnapPoints } from '../utils/getSnapPoints'
import { RichLayout } from './Layout'

const Title = styled('h1')`
  font-size: 1.25rem;
  font-family: ${props => props.theme.legacy.fonts.web.contentFont};
`

const StyledBottomSheet = styled(BottomSheet)<{ bottomOffset: number }>`
  direction: ${props => props.theme.contentDirection};

  /* Position bottom sheet above content */
  z-index: 2;

  [data-rsbs-scroll] {
    margin-bottom: ${props => props.bottomOffset}px;
  }
`

const StyledLayout = styled(RichLayout)<{ bottomOffset: number }>`
  justify-content: flex-start;
  width: 100%;
  min-height: unset;
  padding-bottom: ${props => props.bottomOffset}px;
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
      snapPoints={() => getSnapPoints(dimensions)}
      // snapPoints have been supplied in the previous line
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      defaultSnap={({ snapPoints }) => snapPoints[1]!}
      bottomOffset={dimensions.bottomNavigationHeight ?? 0}>
      <StyledLayout bottomOffset={dimensions.ttsPlayerHeight}>{children}</StyledLayout>
    </StyledBottomSheet>
  )
}

export default BottomActionSheet
