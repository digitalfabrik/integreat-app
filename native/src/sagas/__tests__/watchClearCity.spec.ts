import { runSaga } from 'redux-saga'

import AppSettings from '../../utils/AppSettings'
import { clearCity } from '../watchClearCity'

jest.mock('../../utils/PushNotificationsManager')

describe('watchClearCity', () => {
  it('should clear selected city of app settings', async () => {
    const appSettings = new AppSettings()
    await appSettings.setSelectedCity('augsburg')
    await runSaga(
      {
        dispatch: () => undefined
      },
      clearCity
    ).toPromise()
    expect(await appSettings.loadSelectedCity()).toBeNull()
  })
})
