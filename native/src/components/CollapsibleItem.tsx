// @ts-ignore already opened a pr to fix the missing module declaration https://github.com/marouanekadiri/Accordion-Collapse-react-native/issues/31
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native'
import React, { ReactElement, ReactNode, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import styled from 'styled-components/native'

import { contentDirection } from '../constants/contentDirection'

type CollapsibleItemProps = {
  initExpanded: boolean
  iconSize?: number
  headerText: string
  children: ReactNode
  language: string
}

type CollapsibleHeaderIcon = 'expand-less' | 'expand-more'

const PageContainer = styled.View`
  padding: 16px 48px;
  align-self: center;
  flex: 1;
  min-height: 64px;
`

const CollapseHeaderText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  align-self: center;
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
`

const CollapseHeaderWrapper = styled.View<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
  justify-content: space-between;
  width: 100%;
`

const StyledIcon = styled(Icon)`
  align-self: center;
`

const ICON_SIZE = 30

const CollapsibleItem: React.FC<CollapsibleItemProps> = ({
  initExpanded,
  iconSize = ICON_SIZE,
  children,
  headerText,
  language
}: CollapsibleItemProps): ReactElement => {
  const [isExpanded, setIsExpanded] = useState<boolean>(initExpanded)
  const iconName: CollapsibleHeaderIcon = isExpanded ? 'expand-less' : 'expand-more'
  return (
    <PageContainer>
      <Collapse isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)}>
        <CollapseHeader style={{ flexDirection: 'row' }}>
          <CollapseHeaderWrapper language={language}>
            <CollapseHeaderText>{headerText}</CollapseHeaderText>
            <StyledIcon name={iconName} size={iconSize} />
          </CollapseHeaderWrapper>
        </CollapseHeader>
        <CollapseBody>{children}</CollapseBody>
      </Collapse>
    </PageContainer>
  )
}

export default CollapsibleItem
