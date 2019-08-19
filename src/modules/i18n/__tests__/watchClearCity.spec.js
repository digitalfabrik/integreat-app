// @flow

import { runSaga } from 'redux-saga'
import { clearCity } from '../watchClearCity'

const mockClearCity = jest.fn()
jest.mock('../../settings/AppSettings', () => {
  const createAppSettingsMock = require('../../test-utils/createAppSettingsMock')
  return jest.fn().mockImplementation(() => createAppSettingsMock.default({ clearSelectedCity: mockClearCity }))
})

describe('watchClearCity', () => {
  it('should clear selected city of app settings', async () => {
    await runSaga({
      dispatch: action => {},
      getState: () => ({ value: 'test' })
    }, clearCity)

    expect(mockClearCity).toHaveBeenCalledTimes(1)
  })
})
