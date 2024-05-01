package tuerantuer.app.integreat

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import tuerantuer.app.integreat.constants.NativeConstantsModule
import tuerantuer.app.integreat.fetcher.FetcherModule

class IntegreatPackage : ReactPackage {
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        val modules: MutableList<NativeModule> = ArrayList()
        modules.add(FetcherModule(reactContext))
        modules.add(NativeConstantsModule(reactContext))
        return modules
    }
}
