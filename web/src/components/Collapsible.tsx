import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { helpers } from '../constants/theme'
import Button from './base/Button'
import Icon from './base/Icon'

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const CollapsibleHeader = styled(Button)`
  display: flex;
  justify-content: space-between;
  color: ${props => props.theme.legacy.colors.textColor};
`

const Title = styled(Typography)<TypographyProps>`
  display: flex;
  flex: 1;
  color: ${props => props.theme.palette.text.neutral};
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
        {typeof title === 'string' ? (
          <Title component='span' variant='label1'>
            {title}
          </Title>
        ) : (
          title
        )}
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
