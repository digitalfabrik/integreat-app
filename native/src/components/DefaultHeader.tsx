import { StackHeaderProps } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import { BaseRouteProps, BaseNavigationProps } from '../constants/NavigationTypes'
import Header from './Header'

type HeaderProps = {
  route: BaseRouteProps
  navigation: BaseNavigationProps
}

export const defaultHeader = (headerProps: StackHeaderProps): ReactElement => (
  <Header {...(headerProps as HeaderProps)} />
)
