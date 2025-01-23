package tuerantuer.app.integreat
import expo.modules.ReactActivityDelegateWrapper

import android.content.res.Configuration
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import java.util.Locale

class MainActivity : ReactActivity() {

  private lateinit var currentLocale: Locale

  override fun onCreate(savedInstanceState: Bundle?) {
    // https://github.com/software-mansion/react-native-screens#android
    // https://reactnavigation.org/docs/getting-started/#installing-dependencies-into-a-bare-react-native-project
    super.onCreate(null)
    currentLocale = getResources().configuration.locale
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
      ReactActivityDelegateWrapper(this, BuildConfig.IS_NEW_ARCHITECTURE_ENABLED, DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled))

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)

    val locale = newConfig.locale
    if (!currentLocale.isO3Language.equals(locale.isO3Language)) {
      currentLocale = locale
      reactInstanceManager.recreateReactContextInBackground()
    }
  }
}
