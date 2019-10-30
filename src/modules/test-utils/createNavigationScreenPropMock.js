// @flow

import type { NavigationScreenProp } from 'react-navigation'

export default (): NavigationScreenProp<*> => ({
  state: { params: {}, key: '' },
  dispatch: jest.fn(),
  goBack: jest.fn(),
  dangerouslyGetParent: jest.fn(),
  dismiss: jest.fn(),
  navigate: jest.fn(),
  openDrawer: jest.fn(),
  closeDrawer: jest.fn(),
  toggleDrawer: jest.fn(),
  getParam: jest.fn(),
  setParams: jest.fn(),
  addListener: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
  isFocused: jest.fn()
})
