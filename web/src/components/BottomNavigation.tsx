import MuiBottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction, { bottomNavigationActionClasses } from '@mui/material/BottomNavigationAction'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { CATEGORIES_ROUTE, EVENTS_ROUTE, NEWS_ROUTE, POIS_ROUTE } from 'shared'
import { CityModel } from 'shared/api'

import useCityContentParams from '../hooks/useCityContentParams'
import useDimensions from '../hooks/useDimensions'
import getNavigationItems from '../utils/navigationItems'
import Link from './base/Link'

export const BOTTOM_NAVIGATION_ELEMENT_ID = 'bottom-navigation'

const Container = styled(Paper)({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  // Positon bottom navigation above bottom sheet
  zIndex: 10,
})

const StyledBottomNavigation = styled(MuiBottomNavigation)(({ theme }) => ({
  backgroundColor: theme.palette.background.accent,
})) as typeof MuiBottomNavigation

const StyledBottomNavigationAction = styled(BottomNavigationAction)(({ theme }) => ({
  color: theme.palette.text.secondary,

  [`&.${bottomNavigationActionClasses.selected}`]: {
    color: theme.palette.text.primary,
  },

  [theme.breakpoints.down('sm')]: {
    flex: '1 1 auto',
    minWidth: 'unset',
    overflow: 'hidden',

    [`.${bottomNavigationActionClasses.label}`]: {
      maxWidth: '100%',
    },
  },
})) as typeof BottomNavigationAction

type BottomNavigationProps = {
  cityModel: CityModel
  languageCode: string
}

const BottomNavigation = ({ cityModel, languageCode }: BottomNavigationProps): ReactElement | null => {
  const { route } = useCityContentParams()
  const { t } = useTranslation('layout')
  const { xsmall } = useDimensions()

  const navigationItems = getNavigationItems({ cityModel, languageCode })
  const validTabValues: string[] = [CATEGORIES_ROUTE, POIS_ROUTE, NEWS_ROUTE, EVENTS_ROUTE]
  const value = validTabValues.includes(route) ? route : false

  useEffect(() => {
    window.dispatchEvent(new Event('resize'))
  }, [])

  if (!navigationItems) {
    return null
  }

  return (
    <Container elevation={4}>
      <StyledBottomNavigation
        id={BOTTOM_NAVIGATION_ELEMENT_ID}
        showLabels
        value={value}
        component='nav'
        role='navigation'>
        {navigationItems.map(item => (
          <StyledBottomNavigationAction
            key={item.value}
            component={Link}
            to={item.to}
            value={item.value}
            label={
              xsmall ? (
                <Typography
                  component='div'
                  variant='body3'
                  fontWeight={value === item.value ? 'bold' : 'normal'}
                  overflow='hidden'
                  textOverflow='ellipsis'>
                  {t(item.label)}
                </Typography>
              ) : (
                t(item.label)
              )
            }
            icon={<item.Icon />}
          />
        ))}
      </StyledBottomNavigation>
    </Container>
  )
}

export default BottomNavigation
