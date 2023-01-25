import { useEffect } from 'react'

import appSettings from '../utils/AppSettings'
import * as PushNotificationsManager from '../utils/PushNotificationsManager'
import { reportError } from '../utils/sentry'

type UseSubscribePushNotificationsProps = {
  cityCode: string | null
  languageCode: string | null
  allowPushNotifications: boolean | null
}

const useSubscribePushNotifications = ({
  cityCode,
  languageCode,
  allowPushNotifications,
}: UseSubscribePushNotificationsProps): void => {
  useEffect(() => {
    if (!cityCode || !languageCode || !allowPushNotifications) {
      return () => undefined
    }

    PushNotificationsManager.requestPushNotificationPermission()
      .then(permissionGranted =>
        permissionGranted
          ? PushNotificationsManager.subscribeNews(cityCode, languageCode)
          : appSettings.setSettings({ allowPushNotifications: false })
      )
      .catch(reportError)

    return () => {
      PushNotificationsManager.unsubscribeNews(cityCode, languageCode).catch(reportError)
    }
  }, [cityCode, languageCode, allowPushNotifications])
}

export default useSubscribePushNotifications
