import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { ReactElement } from 'react'

import { BaseRouteProps, BaseNavigationProps } from '../constants/NavigationTypes'
import Header from './Header'

type HeaderProps = {
  route: BaseRouteProps
  navigation: BaseNavigationProps
}

export const defaultHeader = (headerProps: NativeStackHeaderProps): ReactElement => (
  <Header {...(headerProps as HeaderProps)} />
)
