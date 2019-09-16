// @flow

import { runSaga } from 'redux-saga'
import { clearCity } from '../watchClearCity'
import AppSettings from '../../settings/AppSettings'

jest.mock('@react-native-community/async-storage')

describe('watchClearCity', () => {
  it('should clear selected city of app settings', async () => {
    const appSettings = new AppSettings()
    await appSettings.setSelectedCity('augsburg')
    await runSaga({ dispatch: () => {} }, clearCity)

    expect(await appSettings.loadSelectedCity()).toBeNull()
  })
})
