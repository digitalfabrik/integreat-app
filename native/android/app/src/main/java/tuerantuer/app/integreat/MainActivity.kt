package tuerantuer.app.integreat

import android.content.SharedPreferences
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.content.res.Configuration
import android.os.Bundle
import android.preference.PreferenceManager
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import java.io.File
import java.util.Locale

class MainActivity : ReactActivity() {

  private Locale currentLocale

  override fun onCreate(savedInstanceState: Bundle?) {
    // https://github.com/software-mansion/react-native-screens#android
    // https://reactnavigation.org/docs/getting-started/#installing-dependencies-into-a-bare-react-native-project
    super.onCreate(null)
    currentLocale = getResources().getConfiguration().locale
  }

  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   * It is used in native/src/index.ts.
   */
   override fun getMainComponentName(): String = "Integreat"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig)

    Locale locale = newConfig.locale
    if (!currentLocale.getISO3Language().equals(locale.getISO3Language())) {
      currentLocale = locale
      getReactInstanceManager().recreateReactContextInBackground()
    }
  }
}
