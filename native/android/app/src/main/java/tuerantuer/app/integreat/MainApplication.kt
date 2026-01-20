package tuerantuer.app.integreat

import android.app.Application
import android.text.TextUtils
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.modules.i18nmanager.I18nUtil
import java.util.Locale

class MainApplication : Application(), ReactApplication {

    override val reactHost: ReactHost by lazy {
        getDefaultReactHost(
            context = applicationContext,
            packageList =
                PackageList(this).packages.apply {
                    // Packages that cannot be autolinked yet can be added manually here
                    add(IntegreatPackage())
                },
        )
    }

  override fun onCreate() {
    super.onCreate()
    
    I18nUtil.getInstance().allowRTL(this, true)
    
    // Force RTL only if Android reports the current locale as RTL.
    val isRTL = TextUtils.getLayoutDirectionFromLocale(Locale.getDefault()) == android.view.View.LAYOUT_DIRECTION_RTL
    I18nUtil.getInstance().forceRTL(this, isRTL)
    
    loadReactNative(this)
  }
}