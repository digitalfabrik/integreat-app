package tuerantuer.app.integreat.constants

import android.content.pm.PackageManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule

class NativeConstantsModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(
        reactContext
    ) {
    override fun getName(): String {
        return "RNNativeConstants"
    }

    override fun getConstants(): Map<String, Any> {
        val constants: MutableMap<String, Any> = HashMap()
        val packageManager = reactContext.packageManager
        val packageName = reactContext.packageName
        try {
            constants["appVersion"] = packageManager.getPackageInfo(packageName, 0)?.versionName ?: "v1.0.0"
        } catch (e: PackageManager.NameNotFoundException) {
            e.printStackTrace()
        }
        return constants
    }
}
