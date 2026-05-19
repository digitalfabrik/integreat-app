import { StackHeaderProps } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import { NavigationProps, RouteProps, RoutesType } from '../constants/NavigationTypes'
import Header from './Header'

type HeaderProps = {
  route: RouteProps<RoutesType>
  navigation: NavigationProps<RoutesType>
}

export const defaultHeader = (headerProps: StackHeaderProps): ReactElement => (
  <Header {...(headerProps as HeaderProps)} />
)
