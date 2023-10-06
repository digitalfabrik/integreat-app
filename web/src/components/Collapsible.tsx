import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ArrowBackIcon } from '../assets'
import { helpers } from '../constants/theme'
import Icon from './base/Icon'

const CollapsibleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`

const Title = styled.div`
  display: flex;
  flex: 1;
  font-weight: 700;
  justify-content: space-between;
  padding-bottom: 8px;
  ${helpers.adaptiveFontSize}
`

const CollapseIcon = styled(Icon)<{ collapsed: boolean }>`
  transform: rotate(-90deg) ${props => (!props.collapsed ? 'scale(-1)' : '')};
  width: 16px;
  height: 16px;
`

type CollapsibleProps = {
  children: ReactElement | string | number
  title: string | ReactElement
  Description?: ReactElement
  initialCollapsed?: boolean
}

const Collapsible = ({ children, title, Description, initialCollapsed = false }: CollapsibleProps): ReactElement => {
  const [collapsed, setCollapsed] = useState<boolean>(initialCollapsed)
  const { t } = useTranslation('common')

  return (
    <div>
      <CollapsibleHeader
        role='button'
        onClick={() => setCollapsed(!collapsed)}
        tabIndex={0}
        onKeyUp={() => setCollapsed(!collapsed)}>
        {typeof title === 'string' ? <Title>{title}</Title> : title}
        <CollapseIcon
          src={ArrowBackIcon}
          collapsed={collapsed}
          title={t(collapsed ? 'showMore' : 'showLess')}
          directionDependent
        />
      </CollapsibleHeader>
      {Description}
      {!collapsed && children}
    </div>
  )
}

export default Collapsible
