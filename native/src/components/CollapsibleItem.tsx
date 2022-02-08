import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native'
import React, { ReactElement, ReactNode, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { contentDirection } from '../constants/contentDirection'

type CollapsibleItemProps = {
  /** set initial state for collapse */
  initExpanded: boolean
  /** set iconSize for the collapseHeader */
  iconSize?: number
  /** set text for the collapseHeader */
  headerText: string
  children: ReactNode
  /** language to offer rtl support */
  language: string
}

type CollapsibleHeaderIconProps = 'expand-less' | 'expand-more'

const PageContainer = styled.View`
  padding: 20px 48px;
  align-self: center;
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

const DEFAULT_ICON_SIZE = 25

const CollapsibleItem: React.FC<CollapsibleItemProps> = ({
  initExpanded,
  iconSize = DEFAULT_ICON_SIZE,
  children,
  headerText,
  language
}: CollapsibleItemProps): ReactElement => {
  const theme = useTheme()
  const [isExpanded, setIsExpanded] = useState<boolean>(initExpanded)
  const iconName: CollapsibleHeaderIconProps = isExpanded ? 'expand-less' : 'expand-more'
  return (
    <PageContainer>
      <Collapse
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        touchableOpacityProps={{ activeOpacity: 1 }}>
        <CollapseHeader style={{ flexDirection: 'row' }}>
          <CollapseHeaderWrapper language={language}>
            <CollapseHeaderText>{headerText}</CollapseHeaderText>
            <StyledIcon name={iconName} size={iconSize} color={theme.colors.textSecondaryColor} />
          </CollapseHeaderWrapper>
        </CollapseHeader>
        <CollapseBody>{children}</CollapseBody>
      </Collapse>
    </PageContainer>
  )
}

export default CollapsibleItem
