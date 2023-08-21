import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native'
import React, { ReactElement, ReactNode, useState } from 'react'
import styled from 'styled-components/native'

import { ArrowBackIcon } from '../assets'
import { contentDirection } from '../constants/contentDirection'
import Icon from './base/Icon'

type CollapsibleItemProps = {
  initExpanded: boolean
  headerContent: string | ReactElement
  children: ReactNode
  language: string
}

const PageContainer = styled.View`
  align-self: center;
  width: 100%;
`

const CollapseHeaderText = styled.Text`
  font-size: 14px;
  align-self: center;
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
`

const CollapseHeaderWrapper = styled.View<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
  justify-content: space-between;
  width: 100%;
  align-self: center;
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
`

const StyledIcon = styled(Icon)<{ collapsed: boolean }>`
  transform: rotate(90deg) ${props => (props.collapsed ? 'scale(-1)' : '')};
  margin: 0 4px;
  align-self: center;
`

const renderHeaderContent = (headerContent: string | ReactElement): ReactElement => {
  if (typeof headerContent === 'string') {
    return <CollapseHeaderText>{headerContent}</CollapseHeaderText>
  }
  return headerContent
}

const CollapsibleItem = ({ initExpanded, children, headerContent, language }: CollapsibleItemProps): ReactElement => {
  const [isExpanded, setIsExpanded] = useState<boolean>(initExpanded)

  return (
    <PageContainer>
      <Collapse
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        touchableOpacityProps={{ activeOpacity: 1 }}>
        <CollapseHeader style={{ flexDirection: 'row' }}>
          <CollapseHeaderWrapper language={language}>
            {renderHeaderContent(headerContent)}
            <StyledIcon Icon={ArrowBackIcon} collapsed={!isExpanded} width={16} height={16} />
          </CollapseHeaderWrapper>
        </CollapseHeader>
        <CollapseBody>{children}</CollapseBody>
      </Collapse>
    </PageContainer>
  )
}

export default CollapsibleItem
