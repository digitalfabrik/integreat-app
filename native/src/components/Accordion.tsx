import React, { ReactElement, ReactNode, useState } from 'react'
import { View } from 'react-native'
import { List, useTheme } from 'react-native-paper'

type AccordionProps = {
  headerContent: string | ReactElement
  children: ReactNode
  description?: string
  initialCollapsed?: boolean
  nativeID?: string
}

const Accordion = ({
  children,
  headerContent,
  description,
  initialCollapsed = false,
  nativeID,
}: AccordionProps): ReactElement => {
  const [collapsed, setCollapsed] = useState<boolean>(initialCollapsed)
  const theme = useTheme()

  return (
    <View nativeID={nativeID}>
      <List.Accordion
        title={headerContent}
        style={{ paddingVertical: 0, paddingRight: 0, paddingLeft: 0 }}
        contentStyle={{ paddingLeft: 0, paddingRight: 0 }}
        titleStyle={{ fontWeight: 'bold', color: theme.colors.onBackground }}
        expanded={!collapsed}
        onPress={() => setCollapsed(!collapsed)}
        description={description}>
        {children}
      </List.Accordion>
    </View>
  )
}

export default Accordion
