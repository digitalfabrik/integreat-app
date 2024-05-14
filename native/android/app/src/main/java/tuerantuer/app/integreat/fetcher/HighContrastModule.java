package tuerantuer.app.integreat.fetcher;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.util.Log;
import android.content.Context;
import android.view.accessibility.AccessibilityManager;
import com.facebook.react.bridge.Promise;

import java.lang.reflect.Method;


public class HighContrastModule extends ReactContextBaseJavaModule {
    public HighContrastModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "HighContrastModule";
    }

    @ReactMethod
    public void isHighContrastMode(final Promise promise) {
        ReactApplicationContext reactContext = getReactApplicationContext();
        AccessibilityManager accessibilityManager = (AccessibilityManager) reactContext.getSystemService(Context.ACCESSIBILITY_SERVICE);
        Class<?> accessibilityManagerClass = accessibilityManager.getClass();

        Method isHighTextContrastEnabledMethod = null;
        try {
            isHighTextContrastEnabledMethod = accessibilityManagerClass.getMethod("isHighTextContrastEnabled");
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
            promise.reject("Method not found");
        }

        if (isHighTextContrastEnabledMethod != null) {
            boolean result = true;
            try {
                result = (boolean) isHighTextContrastEnabledMethod.invoke(accessibilityManager);
            } catch (Exception e) {
                e.printStackTrace();
                promise.reject("Method call failed");
            }
            promise.resolve(result);
        } else {
            promise.reject("Method not found");
        }
        promise.resolve(1);
    }

}