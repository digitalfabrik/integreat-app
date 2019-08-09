// @flow

import createAppSettings from '../../settings/__tests__/createAppSettings'
import { runSaga } from 'redux-saga'
import watchClearCity from '../watchClearCity'
import { wait } from '@testing-library/react-native'

const mockClearCity = jest.fn()
jest.mock('../../settings/AppSettings', () => ({
  default: createAppSettings({
    clearSelectedCity: mockClearCity
  })
}))

describe('watchClearCity', () => {
  it('should call clear the city in the app settings', async () => {
    const dispatched = []
    runSaga({
      dispatch: action => dispatched.push(action),
      getState: () => ({ value: 'test' })
    }, watchClearCity)
    await wait(() => expect(mockClearCity).toHaveBeenCalledTimes(1))
  })
})
