import { useTheme } from '@emotion/react'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import React, { ReactElement } from 'react'

import Link from './base/Link'

export type NavigationItemProps = {
  text: string
  to: string
  active: boolean
}

const NavigationBar = ({ navigationItems }: { navigationItems: NavigationItemProps[] }): ReactElement => {
  const theme = useTheme()
  return (
    <Tabs
      variant='scrollable'
      scrollButtons='auto'
      value='active'
      sx={{ '.MuiTabs-list': { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', width: 'fit-content' } }}>
      {navigationItems.map(item => (
        <Tab
          key={item.text}
          label={item.text}
          component={Link}
          to={item.to}
          value={item.active ? 'active' : 'inactive'}
          sx={{
            fontWeight: 500,
            color: item.active ? theme.palette.primary.main : theme.palette.neutral[600],
          }}
        />
      ))}
    </Tabs>
  )
}

export default NavigationBar
