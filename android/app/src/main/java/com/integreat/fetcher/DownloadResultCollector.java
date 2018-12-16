package com.integreat.fetcher;

import android.support.annotation.Nullable;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DownloadResultCollector implements FileCallback {
    private final Map<String, String> failedUrls = new HashMap<>();
    private final Map<String, String> succeededUrls = new HashMap<>();
    private final Promise promise;
    private final List<String> expectedUrls;
    private final ReactContext reactContext;

    public DownloadResultCollector(ReactContext reactContext, List<String> expectedUrls, Promise promise) {
        this.promise = promise;
        this.expectedUrls = expectedUrls;
        this.reactContext = reactContext;
    }

    @Override
    public void failed(String url, IOException e) {
        failedUrls.put(url, e.getMessage());
        sendProgress();
        tryToResolve();
    }

    @Override
    public void downloaded(String url, File target) {
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
