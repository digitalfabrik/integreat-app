import styled from '@emotion/styled'
import Divider from '@mui/material/Divider'
import React, { ReactElement, ReactNode, RefObject, useImperativeHandle, useRef, useState } from 'react'
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'
import { SpringEvent } from 'react-spring-bottom-sheet/dist/types'

import { getSnapPoints } from '../utils/getSnapPoints'
import { RichLayout } from './Layout'

const Title = styled.h1`
  font-size: 1.25rem;
  font-family: ${props => props.theme.legacy.fonts.web.contentFont};
`

const ToolbarContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-top: 16px;
`

const StyledSpacer = styled(Divider)`
  margin: 12px 30px;
`

const StyledBottomSheet = styled(BottomSheet)`
  direction: ${props => props.theme.contentDirection};
  z-index: 2;
`

const StyledLayout = styled(RichLayout)`
  width: 100%;
  min-height: unset;
`

export type ScrollableBottomSheetRef = {
  scrollElement: HTMLElement | null
  sheet?: BottomSheetRef | null
}

type BottomActionSheetProps = {
  title?: string
  children: ReactNode
  toolbar: ReactNode
  sibling: ReactNode
  setBottomActionSheetHeight: (height: number) => void
  ref: RefObject<ScrollableBottomSheetRef | null>
}

const BottomActionSheet = ({
  title,
  children,
  toolbar,
  sibling,
  setBottomActionSheetHeight,
  ref,
}: BottomActionSheetProps): ReactElement => {
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null)
  const bottomSheetRef = useRef<BottomSheetRef>(null)
  useImperativeHandle(
    ref,
    () => ({
      sheet: bottomSheetRef.current,
      scrollElement,
    }),
    [bottomSheetRef, scrollElement],
  )
  const initializeScrollElement = (e: SpringEvent) => {
    if (e.type === 'OPEN' && !scrollElement) {
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
      snapPoints={({ maxHeight }) => getSnapPoints(maxHeight)}
      // snapPoints have been supplied in the previous line
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      defaultSnap={({ snapPoints }) => snapPoints[1]!}>
      <StyledLayout>
        {children}
        <ToolbarContainer>
          <StyledSpacer />
          {toolbar}
        </ToolbarContainer>
      </StyledLayout>
    </StyledBottomSheet>
  )
}

export default BottomActionSheet
