// @flow

import { Linking } from 'react-native'
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import buildConfig from '../app/constants/buildConfig'

const openExternalUrl = async (url: string) => {
  try {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url, {
        toolbarColor: buildConfig().lightTheme.colors.themeColor
      })
    } else { Linking.openURL(url) }
  } catch (error) {
    console.error(error)
  }
}

export default openExternalUrl
