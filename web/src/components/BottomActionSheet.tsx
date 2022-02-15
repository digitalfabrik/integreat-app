import React, { ReactElement, ReactNode } from 'react'
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'
import styled from 'styled-components'

import '../styles/BottomActionSheet.css'
import { getSnapPoints } from '../utils/getSnapPoints'

const ListContainer = styled.div`
  padding: 0 30px;
`

const Title = styled.h1`
  font-size: 1.25rem;
  font-family: ${props => props.theme.fonts.web.contentFont};
`

type BottomActionSheetProps = {
  title?: string
  children: ReactNode
}

const BottomActionSheet = React.forwardRef(
  ({ title, children }: BottomActionSheetProps, ref: React.Ref<BottomSheetRef>): ReactElement => (
    <BottomSheet
      ref={ref}
      open
      blocking={false}
      header={title && <Title>{title}</Title>}
      snapPoints={({ maxHeight }) => getSnapPoints(maxHeight)}
      defaultSnap={({ snapPoints }) => snapPoints[1]!}>
      <ListContainer>{children}</ListContainer>
    </BottomSheet>
  )
)

export default BottomActionSheet
