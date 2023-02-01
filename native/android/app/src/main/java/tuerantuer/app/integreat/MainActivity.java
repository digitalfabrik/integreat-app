package tuerantuer.app.integreat;

import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.util.Log;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;

import java.io.File;
import java.util.Locale;

public class MainActivity extends ReactActivity {

    private Locale currentLocale;
    private static final int DOES_NOT_EXIST = -123456;

    private void resetApp() {
        PackageManager m = getPackageManager();

        try {
            PackageInfo info = m.getPackageInfo(getPackageName(), 0);
            deleteRecursive(new File(info.applicationInfo.dataDir));
        } catch (PackageManager.NameNotFoundException e) {
            Log.e("WRAPPER", "Failed to get data directory!", e);
        }
    }

    private void deleteRecursive(File fileOrDirectory) {
        if (fileOrDirectory.isDirectory()) {
            for (File child : fileOrDirectory.listFiles()) {
                deleteRecursive(child);
            }
        }

        fileOrDirectory.delete();
    }

    private void cleanXamarinData() {
        // check if last version was a xamarin version
        // last_location is the key Xamarin uses to save the lastLocationId
        // if no location is selected, last_location will be -1
        SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
        int lastLocation = sharedPref.getInt("last_location", DOES_NOT_EXIST);

        if (lastLocation != DOES_NOT_EXIST) {
            resetApp();
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        cleanXamarinData();
        // https://github.com/software-mansion/react-native-screens/issues/17#issuecomment-862283867
        if (savedInstanceState != null) {
            savedInstanceState.remove("android:support:fragments");
            savedInstanceState.remove("android:fragments");
        }
        super.onCreate(savedInstanceState);
        currentLocale = getResources().getConfiguration().locale;
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     * It is used in native/src/index.ts.
     */
    @Override
    protected String getMainComponentName() {
        return "Integreat";
    }

    /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the renderer you wish to use - the new renderer (Fabric) or the old renderer
   * (Paper).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }
  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }
    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
	
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }
    @Override
    protected boolean isConcurrentRootEnabled() {
      // If you opted-in for the New Architecture, we enable Concurrent Root (i.e. React 18).
      // More on this on https://reactjs.org/blog/2022/03/29/react-v18.html
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }
  }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);

        Locale locale = newConfig.locale;
        if (!currentLocale.getISO3Language().equals(locale.getISO3Language())) {
            currentLocale = locale;
            getReactInstanceManager().recreateReactContextInBackground();
        }
    }
}
