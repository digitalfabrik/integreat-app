// @flow

import { runSaga } from 'redux-saga'
import { clearCity } from '../watchClearCity'
import AppSettings from '../../settings/AppSettings'

jest.mock('@react-native-community/async-storage', () => require('@react-native-community/async-storage/jest/async-storage-mock'))

describe('watchClearCity', () => {
  it('should clear selected city of app settings', async () => {
    const appSettings = new AppSettings()
    await appSettings.setSelectedCity('augsburg')
    await runSaga({ dispatch: () => {} }, clearCity).toPromise()

    expect(await appSettings.loadSelectedCity()).toBeNull()
  })
})
