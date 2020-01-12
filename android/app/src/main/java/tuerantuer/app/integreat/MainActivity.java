package tuerantuer.app.integreat;

import android.content.res.Configuration;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

import java.io.File;
import java.util.Locale;


public class MainActivity extends ReactActivity {

    private Locale currentLocale;

    private void clearCachedContent()
    {
        // delete all files
        File dir = getApplicationContext().getFilesDir();
        if (dir.isDirectory())
        {
            String[] children = dir.list();
            for (int i = 0; i < children.length; i++)
            {
                if (children[i].endsWith(".json")) {
                    new File(dir, children[i]).delete();
                }
            }
        }
    }

    private void clearCachedResources()
    {
        File dir = getApplicationContext().getDataDir();
        if (dir.isDirectory())
        {
            String[] children = dir.list();
            for (int i = 0; i < children.length; i++)
            {
                if (children[i].endsWith(".pdf") || children[i].endsWith(".png") || children[i].endsWith(".jpg")) {
                    new File(dir, children[i]).delete();
                }
            }
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        currentLocale = getResources().getConfiguration().locale;

        // check if last version was a xamarin version
        // last_location is the key Xamarin uses to save the lastLocationId
        // if no location is selected, last_location will be -1
        SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
        int lastLocation = sharedPref.getInt("last_location", -2);

        if(lastLocation != -2){
            //clear storage
            clearCachedContent();
            clearCachedResources();

            //clear sharedPreferences
            sharedPref.edit().clear().commit();
        }
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
