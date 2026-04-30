import * as Sentry from '@sentry/react-native'
import { TFunction } from 'i18next'
import { DateTime } from 'luxon'
import { Role } from 'react-native'
import { openSettings } from 'react-native-permissions'

import { ThemeKey } from 'build-configs/ThemeKey'
import { CONSENT_ROUTE, IMPRINT_ROUTE, LICENSES_ROUTE, MAIN_IMPRINT_ROUTE, SettingsRouteType } from 'shared'

import { SnackbarType } from '../components/SnackbarContainer'
import NativeConstants from '../constants/NativeConstants'
import { NavigationProps } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import { AppContextType } from '../contexts/AppContextProvider'
import urlFromRouteInformation from '../utils/url'
import { SettingsType } from './AppSettings'
import { requestPushNotificationPermission, subscribeNews, unsubscribeNews } from './PushNotificationsManager'
import openExternalUrl from './openExternalUrl'
import { initSentry, log } from './sentry'

export type SettingsSectionType = {
  title: string
  description?: string
  onPress: () => Promise<void> | void
  bigTitle?: boolean
  role?: Role
  hasBadge?: boolean
  getSettingValue?: (settings: SettingsType) => boolean | null
}

const TRIGGER_VERSION_TAPS = 10
const TAP_TIMEOUT = 8

type CreateSettingsSectionsProps = {
  appContext: AppContextType
  navigation: NavigationProps<SettingsRouteType>
  showSnackbar: (snackbar: SnackbarType) => void
  t: TFunction<'error'>
  tapCount: number
  setTapCount: (count: number) => void
  tapStart: DateTime | null
  setTapStart: (start: DateTime | null) => void
}

const createSettingsSections = ({
  appContext: { settings, updateSettings, cityCode, languageCode },
  navigation,
  showSnackbar,
  t,
  tapCount,
  setTapCount,
  tapStart,
  setTapStart,
}: CreateSettingsSectionsProps): (SettingsSectionType | null)[] => {
  const { cmsUrl, switchCmsUrl } = buildConfig()
  const { apiUrlOverride } = settings

  const setApiUrl = (newApiUrl: string) => {
    updateSettings({ apiUrlOverride: newApiUrl })
    setTapCount(0)
    setTapStart(null)
  }

  return [
    {
      title: t('pushNewsTitle'),
      description: t('pushNewsDescription'),
      getSettingValue: (settings: SettingsType) => settings.allowPushNotifications,
      onPress: async () => {
        const newAllowPushNotifications = !settings.allowPushNotifications
        updateSettings({ allowPushNotifications: newAllowPushNotifications })
        if (!cityCode) {
          return
        }
        if (!newAllowPushNotifications) {
          await unsubscribeNews(cityCode, languageCode)
          return
        }

        const status = await requestPushNotificationPermission(updateSettings)

        if (status) {
          await subscribeNews({
            cityCode,
            languageCode,
            allowPushNotifications: newAllowPushNotifications,
            skipSettingsCheck: true,
          })
        } else {
          updateSettings({ allowPushNotifications: false })
          // If the user has rejected the permission once, it can only be changed in the system settings
          showSnackbar({
            text: 'permissionRequired',
            action: {
              label: t('layout:settings'),
              onPress: openSettings,
            },
          })
        }
      },
    },
    {
      title: t('layout:contrastTheme'),
      description: t('layout:contrastThemeDescription'),
      getSettingValue: (settings: SettingsType) => settings.selectedTheme === 'contrast',
      onPress: () => {
        const newTheme: ThemeKey = settings.selectedTheme === 'light' ? 'contrast' : 'light'
        updateSettings({ selectedTheme: newTheme })
      },
    },
    {
      title: t('sentryTitle'),
      description: t('sentryDescription', { appName: buildConfig().appName }),
      getSettingValue: (settings: SettingsType) => settings.errorTracking,
      onPress: async () => {
        const newErrorTracking = !settings.errorTracking
        updateSettings({ errorTracking: newErrorTracking })

        const client = Sentry.getClient()
        if (newErrorTracking && !client) {
          initSentry()
        } else if (client) {
          client.getOptions().enabled = newErrorTracking
        }
      },
    },
    {
      title: t('externalResourcesTitle'),
      description: t('externalResourcesDescription'),
      onPress: () => navigation.navigate(CONSENT_ROUTE),
    },
    {
      role: 'link',
      title: t('layout:imprint'),
      onPress: async () =>
        settings.selectedCity
          ? navigation.navigate(IMPRINT_ROUTE)
          : openExternalUrl(urlFromRouteInformation({ route: MAIN_IMPRINT_ROUTE }), showSnackbar),
    },
    {
      role: 'link',
      title: t('aboutUs'),
      onPress: async () => {
        const { aboutUrls } = buildConfig()
        const aboutUrl = aboutUrls[languageCode] || aboutUrls.default
        await openExternalUrl(aboutUrl, showSnackbar)
      },
    },
    {
      role: 'link',
      title: t('privacyPolicy'),
      onPress: async () => {
        const { privacyUrls } = buildConfig()
        const privacyUrl = privacyUrls[languageCode] || privacyUrls.default
        await openExternalUrl(privacyUrl, showSnackbar)
      },
    },
    {
      role: 'link',
      title: t('layout:accessibility'),
      onPress: async () => {
        const { accessibilityUrls } = buildConfig()
        const accessibilityUrl = accessibilityUrls[languageCode] ?? accessibilityUrls.default
        await openExternalUrl(accessibilityUrl, showSnackbar)
      },
    },
    {
      title: t('openSourceLicenses'),
      onPress: () => navigation.navigate(LICENSES_ROUTE),
    },
    {
      role: 'link',
      title: t('SBoM'),
      onPress: async () => {
        const linkToSBoM = `https://github.com/digitalfabrik/integreat-app/releases/tag/${NativeConstants.appVersion}`
        await openExternalUrl(linkToSBoM, showSnackbar)
      },
    },
    {
      title: t('version', { version: NativeConstants.appVersion }),
      onPress: () => {
        if (!switchCmsUrl) {
          return
        }

        const clickedInTimeInterval = tapStart && tapStart > DateTime.now().minus({ seconds: TAP_TIMEOUT })

        if (tapCount + 1 >= TRIGGER_VERSION_TAPS && clickedInTimeInterval) {
          const newApiUrl = !apiUrlOverride || apiUrlOverride === cmsUrl ? switchCmsUrl : cmsUrl
          setApiUrl(newApiUrl)
          log(`Switching to new API-Url: ${newApiUrl}`)
          showSnackbar({ text: 'Switched to CMS url' })
        } else {
          const newTapStart = clickedInTimeInterval ? tapStart : DateTime.now()
          const newTapCount = clickedInTimeInterval ? tapCount + 1 : 1
          setTapCount(newTapCount)
          setTapStart(newTapStart)
        }
      },
    },
  ]
}

export default createSettingsSections
