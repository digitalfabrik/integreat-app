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

const ExpandIcon = styled(Icon)`
  transform: rotate(-90deg);
  width: 16px;
  height: 16px;
`

const CollapseIcon = styled(Icon)`
  transform: rotate(-90deg) scale(-1);
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
        {/* Do not simplify this, we need to render two different icons to force the title to update! */}
        {collapsed ? (
          <ExpandIcon src={ArrowBackIcon} title={t('showMore')} directionDependent />
        ) : (
          <CollapseIcon src={ArrowBackIcon} title={t('showLess')} directionDependent />
        )}
      </CollapsibleHeader>
      {Description}
      {!collapsed && children}
    </div>
  )
}

export default Collapsible
