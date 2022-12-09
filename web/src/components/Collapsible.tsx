import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'

import { UiDirectionType } from 'translations'

import { faAngleDown, faAngleUp } from '../constants/icons'

type CollapsibleProps = {
  children: ReactElement | string | number
  title: string | ReactElement
  initialCollapsed?: boolean
  direction: UiDirectionType
}

const ContentWrapper = styled.div<{ direction: string }>`
  padding: 8px 0;
  ${props => (props.direction === 'rtl' ? `padding-left: 26px;` : `padding-right: 26px;`)}
  display: block;
`
const CollapsibleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  outline: none;
`
const Title = styled.div`
  display: flex;
  flex: 1;
  font-weight: 700;
  font-size: clamp(0.55rem, 1.6vh, ${props => props.theme.fonts.hintFontSize});
  justify-content: space-between;
`
const StyledIcon = styled(FontAwesomeIcon)`
  font-size: 18px;
`

const Collapsible: React.FC<CollapsibleProps> = ({
  children,
  title,
  initialCollapsed = true,
  direction,
}: CollapsibleProps): ReactElement => {
  const [collapsed, setCollapsed] = useState<boolean>(initialCollapsed)

  // By changing title reset to initalCollapsed state
  useEffect(() => {
    setCollapsed(initialCollapsed)
  }, [initialCollapsed, title])

  return (
    <>
      <CollapsibleHeader
        role='button'
        onClick={() => setCollapsed(!collapsed)}
        tabIndex={0}
        onKeyPress={() => setCollapsed(!collapsed)}>
        <Title>{title}</Title>
        <StyledIcon icon={collapsed ? faAngleUp : faAngleDown} />
      </CollapsibleHeader>
      {collapsed && <ContentWrapper direction={direction}>{children}</ContentWrapper>}
    </>
  )
}

export default Collapsible
