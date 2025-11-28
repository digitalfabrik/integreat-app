import { Collapse, CollapseBody, CollapseHeader } from 'accordion-collapse-react-native'
import React, { ReactElement, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

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

const StyledIcon = styled(Icon)`
  margin: 0 4px;
  align-self: center;
`

type CollapsibleProps = {
  headerContent: string | ReactElement
  children: ReactNode
  Description?: ReactElement
  language: string
  initialCollapsed?: boolean
}

const Collapsible = ({
  children,
  headerContent,
  Description,
  language,
  initialCollapsed = false,
}: CollapsibleProps): ReactElement => {
  const [collapsed, setCollapsed] = useState<boolean>(initialCollapsed)
  const { t } = useTranslation()

  return (
    <PageContainer>
      <Collapse
        isExpanded={!collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        touchableOpacityProps={{ activeOpacity: 1 }}>
        <CollapseHeader style={{ flexDirection: 'column' }}>
          <CollapseHeaderWrapper language={language}>
            {typeof headerContent === 'string' ? (
              <CollapseHeaderText>{headerContent}</CollapseHeaderText>
            ) : (
              headerContent
            )}
            <StyledIcon
              source={collapsed ? 'chevron-up' : 'chevron-down'}
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
