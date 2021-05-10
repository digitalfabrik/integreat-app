import { NavigationPropType, RoutesType } from '../modules/app/constants/NavigationTypes'

const createNavigationMock = <T extends RoutesType>(): NavigationPropType<T> => ({
  dispatch: jest.fn(),
  canGoBack: jest.fn(),
  goBack: jest.fn(),
  dangerouslyGetParent: jest.fn(),
  dangerouslyGetState: jest.fn(),
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
