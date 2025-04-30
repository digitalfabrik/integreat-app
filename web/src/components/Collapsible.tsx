import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ArrowBackIcon } from '../assets'
import { helpers } from '../constants/theme'
import Button from './base/Button'
import Icon from './base/Icon'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const CollapsibleHeader = styled(Button)<{ $isParent?: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: ${props => (props.$isParent ? '12px 0' : 0)};
`

const Title = styled.div<{ $isParent?: boolean }>`
  display: flex;
  flex: 1;
  font-weight: 700;
  justify-content: space-between;
  ${props => (props.$isParent ? helpers.adaptiveMediumFontSize : helpers.adaptiveFontSize)}
`

const CollapseIcon = styled(Icon)<{ $collapsed: boolean }>`
  transform: rotate(-90deg) ${props => (!props.$collapsed ? 'scale(-1)' : '')};
  width: 16px;
  height: 16px;
`

type CollapsibleProps = {
  children: ReactElement | string | number
  title: string | ReactElement
  Description?: ReactElement
  initialCollapsed?: boolean
  className?: string
  isParent?: boolean
}

const Collapsible = ({
  children,
  title,
  Description,
  initialCollapsed = false,
  isParent = false,
  className,
}: CollapsibleProps): ReactElement => {
  const [collapsed, setCollapsed] = useState<boolean>(initialCollapsed)
  const { t } = useTranslation('common')

  return (
    <Container className={className}>
      <CollapsibleHeader
        $isParent={isParent}
        label={t(collapsed ? 'showMore' : 'showLess')}
        onClick={() => setCollapsed(!collapsed)}
        aria-expanded={!collapsed}
        tabIndex={0}>
        {typeof title === 'string' ? <Title $isParent={isParent}>{title}</Title> : title}
        <CollapseIcon
          src={ArrowBackIcon}
          $collapsed={collapsed}
          title={t(collapsed ? 'showMore' : 'showLess')}
          directionDependent
        />
      </CollapsibleHeader>
      {Description}
      {!collapsed && children}
    </Container>
  )
}

export default Collapsible
