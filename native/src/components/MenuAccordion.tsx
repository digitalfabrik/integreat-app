import React, { ReactElement } from 'react'
import { Divider, Menu, useTheme } from 'react-native-paper'

import { join } from 'shared'

import { contentAlignmentRTLText } from '../constants/contentDirection'

export const withDividers = (items: (ReactElement | null)[]): ReactElement[] =>
  join(
    items.filter(it => it !== null),
    index => <Divider key={index} />,
  )

type MenuAccordionProps = {
  title: string
  items: ReactElement[]
  expanded: boolean
  setExpanded: (expanded: boolean) => void
  icon?: string
}

const MenuAccordion = ({ title, items, setExpanded, expanded, icon }: MenuAccordionProps): ReactElement => {
  const theme = useTheme()

  return (
    <>
      <Menu.Item
        onPress={() => setExpanded(!expanded)}
        title={title}
        leadingIcon={icon}
        trailingIcon={expanded ? 'chevron-up' : 'chevron-down'}
        style={{
          backgroundColor: theme.dark ? theme.colors.surfaceVariant : theme.colors.surface,
        }}
        titleStyle={{ textAlign: contentAlignmentRTLText(title), paddingRight: 8 }}
        contentStyle={{ flex: 1 }}
        accessibilityLabel={title}
        accessibilityState={{ expanded }}
      />
      {expanded && (
        <>
          <Divider />
          {withDividers(items)}
        </>
      )}
    </>
  )
}

export default MenuAccordion
