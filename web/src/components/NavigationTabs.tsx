import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useTheme } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { CATEGORIES_ROUTE, EVENTS_ROUTE, NEWS_ROUTE, POIS_ROUTE } from 'shared'
import { CityModel } from 'shared/api'

import useCityContentParams from '../hooks/useCityContentParams'
import getNavigationItems from '../utils/navigationItems'
import Link from './base/Link'

type NavigationTabsProps = {
  cityModel: CityModel
  languageCode: string
}

const NavigationTabs = ({ cityModel, languageCode }: NavigationTabsProps): ReactElement | null => {
  const { route } = useCityContentParams()
  const { t } = useTranslation('layout')
  const theme = useTheme()
  const color = theme.isContrastTheme ? 'secondary' : 'primary'

  const navigationItems = getNavigationItems({ cityModel, languageCode })
  const allTabValues: string[] = [CATEGORIES_ROUTE, POIS_ROUTE, NEWS_ROUTE, EVENTS_ROUTE]
  const currentTabValue = allTabValues.includes(route) ? route : false

  if (!navigationItems) {
    return null
  }

  return (
    <Tabs value={currentTabValue} component='nav' textColor={color} indicatorColor={color}>
      {navigationItems.map(item => (
        <Tab key={item.value} component={Link} to={item.to} value={item.value} label={t(item.label)} />
      ))}
    </Tabs>
  )
}

export default NavigationTabs
