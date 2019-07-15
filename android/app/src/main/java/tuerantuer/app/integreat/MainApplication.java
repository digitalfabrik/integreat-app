package tuerantuer.app.integreat;

import android.app.Application;

import com.RNFetchBlob.RNFetchBlobPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.facebook.react.ReactApplication;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;

import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.rumax.reactnative.pdfviewer.PDFViewPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import io.sentry.RNSentryPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new AsyncStoragePackage(),
                    new RNSentryPackage(),
                    new RNFetchBlobPackage(),
                    new RNCWebViewPackage(),
                    new PDFViewPackage(),
                    new VectorIconsPackage(),
                    new RNGestureHandlerPackage(),
                    new FastImageViewPackage(),
                    new IntegreatPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
