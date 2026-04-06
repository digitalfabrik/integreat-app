package tuerantuer.app.integreat

import android.content.res.Configuration
import android.os.Bundle
import android.view.View
import androidx.core.text.TextUtilsCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.modules.i18nmanager.I18nUtil

import java.util.Locale

class MainActivity : ReactActivity() {

  private lateinit var currentLocale: Locale

  override fun onCreate(savedInstanceState: Bundle?) {
    // Workaround for the layout not being RTL for RTL languages
    // https://github.com/facebook/react-native/pull/53417
    // https://github.com/digitalfabrik/integreat-app/issues/3759
    val locale = resources.configuration.locales[0]
    val isRTL = TextUtilsCompat.getLayoutDirectionFromLocale(locale) == View.LAYOUT_DIRECTION_RTL

    I18nUtil.instance.allowRTL(this, true)
    I18nUtil.instance.forceRTL(this, isRTL)
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
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)

    val locale = newConfig.locale
    if (!currentLocale.isO3Language.equals(locale.isO3Language)) {
      currentLocale = locale
      reactInstanceManager.recreateReactContextInBackground()
    }
  }
}
