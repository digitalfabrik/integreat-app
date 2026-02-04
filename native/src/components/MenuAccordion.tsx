import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
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

const IconPlaceholder = () => <View style={{ width: 40 }} />

const MenuAccordion = ({ title, items, setExpanded, expanded, icon }: MenuAccordionProps): ReactElement => {
  const { t } = useTranslation('common')
  const theme = useTheme()

  return (
    <>
      <Menu.Item
        onPress={() => setExpanded(!expanded)}
        title={title}
        leadingIcon={icon ?? IconPlaceholder}
        trailingIcon={expanded ? 'chevron-up' : 'chevron-down'}
        style={{
          backgroundColor: theme.dark ? theme.colors.surfaceVariant : theme.colors.surface,
        }}
        titleStyle={{ textAlign: contentAlignmentRTLText(title), paddingRight: 8 }}
        contentStyle={{ flex: 1 }}
        accessibilityLabel={t(expanded ? 'showLess' : 'showMore')}
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
