package tuerantuer.app.integreat;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import tuerantuer.app.integreat.constants.NativeConstantsModule;
import tuerantuer.app.integreat.fetcher.FetcherModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class IntegreatPackage implements ReactPackage {

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new FetcherModule(reactContext));
        modules.add(new NativeConstantsModule(reactContext));
        return modules;
    }
}
