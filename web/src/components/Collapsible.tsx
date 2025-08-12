import styled from '@emotion/styled'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  color: ${props => props.theme.legacy.colors.textColor};
`

const Title = styled.div`
  display: flex;
  flex: 1;
  font-weight: 700;
  justify-content: space-between;
  ${helpers.adaptiveFontSize}
  align-items: center;
`

const CollapseIcon = styled(Icon)`
  width: 24px;
  height: 24px;
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
          src={collapsed ? ExpandMoreIcon : ExpandLessIcon}
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
