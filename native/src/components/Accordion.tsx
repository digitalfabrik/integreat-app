import React, { ReactElement, ReactNode, useState } from 'react'
import { List, useTheme } from 'react-native-paper'
import styled from 'styled-components/native'

const HeaderText = styled.Text`
  font-weight: bold;
  color: ${props => props.theme.colors.onBackground};
`

type AccordionProps = {
  headerContent: string | ReactElement
  children: ReactNode
  description?: string
  initialCollapsed?: boolean
}

const Accordion = ({
  children,
  headerContent,
  description,
  initialCollapsed = false,
}: AccordionProps): ReactElement => {
  const [collapsed, setCollapsed] = useState<boolean>(initialCollapsed)
  const theme = useTheme()

  return (
    <List.Accordion
      title={typeof headerContent === 'string' ? <HeaderText>{headerContent}</HeaderText> : headerContent}
      titleStyle={{ fontWeight: 'bold', color: theme.colors.onBackground }}
      expanded={!collapsed}
      onPress={() => setCollapsed(!collapsed)}
      rippleColor='transparent'
      description={description}>
      {children}
    </List.Accordion>
  )
}

export default Accordion
