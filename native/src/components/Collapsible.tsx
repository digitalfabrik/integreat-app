import { Collapse, CollapseBody, CollapseHeader } from 'accordion-collapse-react-native'
import React, { ReactElement, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { ArrowBackIcon } from '../assets'
import { contentDirection } from '../constants/contentDirection'
import Icon from './base/Icon'

const PageContainer = styled.View`
  align-self: center;
  width: 100%;
`

const CollapseHeaderText = styled.Text`
  font-size: 14px;
  align-self: center;
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontBold};
  color: ${props => props.theme.legacy.colors.textColor};
`

const CollapseHeaderWrapper = styled.View<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
  justify-content: space-between;
  width: 100%;
  align-self: center;
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontBold};
`

const StyledIcon = styled(Icon)<{ collapsed: boolean }>`
  transform: rotate(90deg) ${props => (props.collapsed ? 'scale(-1)' : '')};
  margin: 0 4px;
  align-self: center;
  width: 16px;
  height: 16px;
`

type CollapsibleProps = {
  headerContent: string | ReactElement
  headerContentExpanded?: string | ReactElement
  children: ReactNode
  Description?: ReactElement
  language: string
  initialCollapsed?: boolean
  iconColor?: string
}

const Collapsible = ({
  children,
  headerContent,
  headerContentExpanded,
  Description,
  language,
  initialCollapsed = false,
  iconColor,
}: CollapsibleProps): ReactElement => {
  const [collapsed, setCollapsed] = useState<boolean>(initialCollapsed)
  const { t } = useTranslation()

  const displayHeader = collapsed ? headerContent : (headerContentExpanded ?? headerContent)

  return (
    <PageContainer>
      <Collapse
        isExpanded={!collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        touchableOpacityProps={{ activeOpacity: 1 }}>
        <CollapseHeader style={{ flexDirection: 'column' }}>
          <CollapseHeaderWrapper language={language}>
            {typeof displayHeader === 'string' ? (
              <CollapseHeaderText>{displayHeader}</CollapseHeaderText>
            ) : (
              displayHeader
            )}
            <StyledIcon
              color={iconColor}
              Icon={ArrowBackIcon}
              collapsed={collapsed}
              label={t(collapsed ? 'showMore' : 'showLess')}
            />
          </CollapseHeaderWrapper>
          {Description}
        </CollapseHeader>
        <CollapseBody>{children}</CollapseBody>
      </Collapse>
    </PageContainer>
  )
}

export default Collapsible
