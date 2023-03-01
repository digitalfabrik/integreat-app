import React, { ReactElement, ReactNode, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'
import styled, { useTheme } from 'styled-components'

import { getSlugFromPath } from 'api-client/src'
import { UiDirectionType } from 'translations'

import '../styles/BottomActionSheet.css'
import { getSnapPoints } from '../utils/getSnapPoints'
import Spacer from './Spacer'

const ListContainer = styled.div`
  padding: 0 30px;
`

const Title = styled.h1`
  font-size: 1.25rem;
  font-family: ${props => props.theme.fonts.web.contentFont};
`

const ToolbarContainer = styled.div`
  margin-top: 16px;
`

const StyledSpacer = styled(Spacer)`
  margin: 12px 30px;
`

const StyledBottomSheet = styled(BottomSheet)<{ direction: string }>`
  direction: ${props => props.direction};
`

type BottomActionSheetProps = {
  title?: string
  children: ReactNode
  toolbar: ReactNode
  direction: UiDirectionType
  setBottomActionSheetHeight: (height: number) => void
}

const BottomActionSheet = React.forwardRef(
  (
    { title, children, toolbar, direction, setBottomActionSheetHeight }: BottomActionSheetProps,
    ref: React.Ref<BottomSheetRef>
  ): ReactElement => {
    const theme = useTheme()
    const listRef = useRef<HTMLDivElement>(null)
    const previousPath = useLocation().state?.from?.pathname

    useEffect(() => {
      // scrollTo the id of the selected element for detail view -> list view
      if (previousPath) {
        document.getElementById(getSlugFromPath(decodeURI(previousPath)))?.scrollIntoView({ behavior: 'auto' })
      } else {
        // ScrollToTop while title changes for indicating switch list->detail view
        listRef.current?.scrollIntoView({ behavior: 'auto' })
      }
    }, [previousPath, title])

    return (
      <StyledBottomSheet
        direction={direction}
        ref={ref}
        open
        scrollLocking={false}
        blocking={false}
        id='sheet'
        // @ts-expect-error current can't be used when forwardRef is used
        onSpringEnd={() => setBottomActionSheetHeight(ref?.current?.height)}
        header={title ? <Title>{title}</Title> : null}
        snapPoints={({ maxHeight }) => getSnapPoints(maxHeight)}
        defaultSnap={({ snapPoints }) => snapPoints[1]!}>
        <ListContainer id='scroller' ref={listRef}>
          {children}
        </ListContainer>
        <StyledSpacer borderColor={theme.colors.poiBorderColor} />
        <ToolbarContainer>{toolbar}</ToolbarContainer>
      </StyledBottomSheet>
    )
  }
)

export default BottomActionSheet
