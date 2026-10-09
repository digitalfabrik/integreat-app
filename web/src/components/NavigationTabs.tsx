import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { CATEGORIES_ROUTE, EVENTS_ROUTE, NEWS_ROUTE, PLACES_ROUTE } from 'shared'
import { RegionModel } from 'shared/api'

import { NAVIGATION_TABS_ELEMENT_ID } from '../constants/layout'
import useRegionContentParams from '../hooks/useRegionContentParams'
import getNavigationItems from '../utils/navigationItems'
import Link from './base/Link'

type NavigationTabsProps = {
  regionModel: RegionModel
  languageCode: string
}

const NavigationTabs = ({ regionModel, languageCode }: NavigationTabsProps): ReactElement | null => {
  const { route } = useRegionContentParams()
  const { t } = useTranslation()

  const navigationItems = getNavigationItems({ regionModel, languageCode })
  const allTabValues: string[] = [CATEGORIES_ROUTE, PLACES_ROUTE, NEWS_ROUTE, EVENTS_ROUTE]
  const currentTabValue = allTabValues.includes(route) ? route : false

  if (!navigationItems) {
    return null
  }

  return (
    <Tabs id={NAVIGATION_TABS_ELEMENT_ID} value={currentTabValue} component='nav'>
      {navigationItems.map(item => (
        <Tab key={item.value} component={Link} to={item.to} value={item.value} label={t($ => $[item.value].title)} />
      ))}
    </Tabs>
  )
}

export default NavigationTabs
