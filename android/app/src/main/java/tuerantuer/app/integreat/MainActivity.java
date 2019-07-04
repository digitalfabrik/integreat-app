package tuerantuer.app.integreat;

import android.content.res.Configuration;
import android.os.Bundle;
import com.facebook.react.ReactActivity;

import java.util.Locale;

public class MainActivity extends ReactActivity {

    private Locale currentLocale;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
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
