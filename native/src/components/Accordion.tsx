import React, { ReactElement, ReactNode, useState } from 'react'
import { List, useTheme } from 'react-native-paper'

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
      title={headerContent}
      style={{ paddingVertical: 0, paddingRight: 0, paddingLeft: 0 }}
      contentStyle={{ paddingLeft: 0, paddingRight: 0 }}
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
