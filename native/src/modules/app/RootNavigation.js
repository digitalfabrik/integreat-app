// @flow

import React from 'react'
import { CATEGORIES_ROUTE } from './constants/NavigationTypes'
import { cityContentUrl } from '../common/url'
import { CommonActions, StackActions } from '@react-navigation/native';

export const navigationRef = React.createRef()

export function navigate (name: string, params: any) {
  navigationRef.current?.dispatch(CommonActions.navigate({ name: 'categories' }))
  // navigationRef.current?.navigate({
  //   name: 'categories'
  // })
}

export function push (origin: string) {
  console.log("RootNavigation from ", origin)
  navigationRef.current?.dispatch(CommonActions.navigate({ name: 'categories' }))
}
