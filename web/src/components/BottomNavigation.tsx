import MuiBottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { CATEGORIES_ROUTE, EVENTS_ROUTE, NEWS_ROUTE, POIS_ROUTE } from 'shared'
import { CityModel } from 'shared/api'

import useCityContentParams from '../hooks/useCityContentParams'
import getNavigationItems from '../utils/navigationItems'
import Link from './base/Link'

export const BOTTOM_NAVIGATION_ELEMENT_ID = 'bottom-navigation'

const Container = styled(Paper)({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
})

type BottomNavigationProps = {
  cityModel: CityModel
  languageCode: string
}

const BottomNavigation = ({ cityModel, languageCode }: BottomNavigationProps): ReactElement | null => {
  const { route } = useCityContentParams()
  const { t } = useTranslation('layout')

  const navigationItems = getNavigationItems({ cityModel, languageCode })
  const validTabValues: string[] = [CATEGORIES_ROUTE, POIS_ROUTE, NEWS_ROUTE, EVENTS_ROUTE]
  const value = validTabValues.includes(route) ? route : false

  if (!navigationItems) {
    return null
  }

  return (
    <Container elevation={4}>
      <MuiBottomNavigation id={BOTTOM_NAVIGATION_ELEMENT_ID} showLabels value={value} component='nav'>
        {navigationItems.map(item => (
          <BottomNavigationAction
            key={item.value}
            component={Link}
            to={item.to}
            value={item.value}
            label={t(item.label)}
            icon={<item.Icon />}
          />
        ))}
      </MuiBottomNavigation>
    </Container>
  )
}

export default BottomNavigation
