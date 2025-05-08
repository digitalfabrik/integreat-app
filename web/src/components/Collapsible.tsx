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

const CollapsibleHeader = styled(Button)`
  display: flex;
  justify-content: space-between;
  color: ${props => props.theme.colors.textColor};
`

const Title = styled.div`
  display: flex;
  flex: 1;
  font-weight: 700;
  justify-content: space-between;
  ${helpers.adaptiveFontSize}
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
}

const Collapsible = ({
  children,
  title,
  Description,
  initialCollapsed = false,
  className,
}: CollapsibleProps): ReactElement => {
  const [collapsed, setCollapsed] = useState<boolean>(initialCollapsed)
  const { t } = useTranslation('common')

  return (
    <Container className={className}>
      <CollapsibleHeader
        label={t(collapsed ? 'showMore' : 'showLess')}
        onClick={() => setCollapsed(!collapsed)}
        aria-expanded={!collapsed}
        tabIndex={0}>
        {typeof title === 'string' ? <Title>{title}</Title> : title}
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
