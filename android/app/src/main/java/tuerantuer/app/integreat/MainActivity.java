package tuerantuer.app.integreat;

import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.util.Log;
import com.facebook.react.ReactActivity;

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
        super.onCreate(savedInstanceState);
        currentLocale = getResources().getConfiguration().locale;
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Integreat";
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
