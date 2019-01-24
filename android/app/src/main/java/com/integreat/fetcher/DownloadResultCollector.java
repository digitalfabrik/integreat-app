package com.integreat.fetcher;

import android.support.annotation.Nullable;
import android.util.Log;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.integreat.BuildConfig;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class DownloadResultCollector implements FileDownloadCallback {
    /**
     * This needs to be a HashMap because duplicate urls count as one single url
     */
    private final Map<String, String> failedUrls = new HashMap<>();
    /**
     * This needs to be a HashMap because duplicate urls count as one single url
     */
    private final Map<String, String> succeededUrls = new HashMap<>();
    private final Promise promise;
    /**
     * This needs to be a Set because duplicate urls count as one single url
     */
    private final Set<String> expectedUrls;
    private final ReactContext reactContext;

    public DownloadResultCollector(ReactContext reactContext, Set<String> expectedUrls, Promise promise) {
        this.promise = promise;
        this.expectedUrls = expectedUrls;
        this.reactContext = reactContext;
    }

    @Override
    public void failed(String url, String message) {
        if (BuildConfig.DEBUG) {
            Log.e("FetcherModule", "Failed to download " + url + ": " + message);
        }
        failedUrls.put(url, message);
        sendProgress();
        tryToResolve();
    }

    @Override
    public void downloaded(String url, File target) {
        if (BuildConfig.DEBUG) {
            Log.d("FetcherModule", "Downloaded " + url);
        }
        succeededUrls.put(url, target.getAbsolutePath());
        sendProgress();
        tryToResolve();
    }

    private void tryToResolve() {
        if (failedUrls.size() + succeededUrls.size() != expectedUrls.size()) {
            return;
        }

        WritableMap result = Arguments.createMap();

        WritableMap failed = Arguments.createMap();
        for (Map.Entry<String, String> entry : failedUrls.entrySet()) {
            failed.putString(entry.getKey(), entry.getValue());
        }

        result.putMap("failureMessages", failed);


        WritableMap succeeded = Arguments.createMap();
        for (Map.Entry<String, String> entry : succeededUrls.entrySet()) {
            succeeded.putString(entry.getKey(), entry.getValue());
        }

        result.putMap("successFilePaths", succeeded);

        promise.resolve(result);
    }

    private void sendProgress() {
        sendEvent("progress", (double) (failedUrls.size() + succeededUrls.size()) / expectedUrls.size());
    }

    private void sendEvent(String eventName,
                           @Nullable Object params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
