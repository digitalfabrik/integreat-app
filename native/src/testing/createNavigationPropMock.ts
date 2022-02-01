import { DASHBOARD_ROUTE } from 'api-client'

import { NavigationPropType, RoutesType } from '../constants/NavigationTypes'

const createNavigationMock = <T extends RoutesType>(routeIndex = 0): NavigationPropType<T> => ({
  dispatch: jest.fn(),
  canGoBack: jest.fn(() => routeIndex > 0),
  goBack: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn(() => ({
    index: routeIndex,
    routes: [{ key: 'some-key-0', name: DASHBOARD_ROUTE }],
    key: 'some-key-0',
    routeNames: [DASHBOARD_ROUTE],
    type: 'stack',
    stale: false
  })),
  navigate: jest.fn(),
  setParams: jest.fn(),
  addListener: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
  isFocused: jest.fn(),
  reset: jest.fn(),
  removeListener: jest.fn(),
  setOptions: jest.fn()
})

export default createNavigationMock
