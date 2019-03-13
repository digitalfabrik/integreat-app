package com.integreat.fetcher;

import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.integreat.BuildConfig;

import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class DownloadResultCollector implements FileDownloadCallback {
    /**
     * This needs to be a HashMap because duplicate urls count as one single url
     */
    private final Map<String, String> errorMessages = new HashMap<>();
    /**
     * This needs to be a HashMap because duplicate urls count as one single url
     */
    private final Map<String, String> successFilePaths = new HashMap<>();
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
    public synchronized void failed(String url, String message) {
        errorMessages.put(url, message);

        if (BuildConfig.DEBUG) {
            Log.e("FetcherModule", "[" + currentDownloadCount() + "/" + expectedUrls.size() + "] Failed to download " + url + ": " + message);
        }
        sendProgress();
        tryToResolve();
    }

    @Override
    public synchronized void downloaded(String url, File target) {
        successFilePaths.put(url, target.getAbsolutePath());
        if (BuildConfig.DEBUG) {
            Log.d("FetcherModule", "[" + currentDownloadCount() + "/" + expectedUrls.size() + "] Downloaded " + url);
        }
        sendProgress();
        tryToResolve();
    }

    private int currentDownloadCount() {
        return errorMessages.size() + successFilePaths.size();
    }

    private void tryToResolve() {
        if (currentDownloadCount() != expectedUrls.size()) {
            return;
        }

        WritableMap result = Arguments.createMap();

        WritableMap failed = Arguments.createMap();
        for (Map.Entry<String, String> entry : errorMessages.entrySet()) {
            failed.putString(entry.getKey(), entry.getValue());
        }

        result.putMap("failureMessages", failed);


        WritableMap succeeded = Arguments.createMap();
        for (Map.Entry<String, String> entry : successFilePaths.entrySet()) {
            succeeded.putString(entry.getKey(), entry.getValue());
        }

        result.putMap("successFilePaths", succeeded);

        Log.d("FetcherModule", "Resolving promise");
        promise.resolve(result);
    }

    private void sendProgress() {
        sendEvent("progress", (double) (errorMessages.size() + successFilePaths.size()) / expectedUrls.size());
    }

    private void sendEvent(String eventName,
                           @Nullable Object params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
