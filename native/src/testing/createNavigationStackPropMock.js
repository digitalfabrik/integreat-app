// @flow

import type { NavigationStackProp } from 'react-navigation-stack'
import type { NavigationAction } from 'react-navigation-stack'

type NavigationParamsType = { [key: string]: mixed, ... }

let params: NavigationParamsType = {}

// $FlowFixMe
const getParam: GetParamType = jest.fn<[string, *], *>((paramName: string, fallback: *) => {
  if (params[paramName]) {
    return params[paramName]
  }
  return fallback
})

export default (): NavigationStackProp<*> => ({
  state: {
    params: {},
    key: ''
  },
  dispatch: jest.fn(),
  goBack: jest.fn(),
  dangerouslyGetParent: jest.fn(),
  dismiss: jest.fn(),
  navigate: jest.fn(),
  openDrawer: jest.fn(),
  closeDrawer: jest.fn(),
  toggleDrawer: jest.fn(),
  getParam,
  setParams: jest.fn((newParams: NavigationParamsType) => {
    params = {
      ...params,
      ...newParams
    }
    return true
  }),
  addListener: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
  isFocused: jest.fn(),
  reset: jest.fn((actions: NavigationAction[], index: number) => false),
})
