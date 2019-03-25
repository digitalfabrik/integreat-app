package com.integreat.fetcher;

import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.integreat.BuildConfig;

import java.io.File;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class DownloadResultCollector implements FileDownloadCallback {
    private final Map<String, String> errorMessages = new HashMap<>();
    private final Map<String, DownloadResult> resourceCache = new HashMap<>();
    private final Promise promise;
    /**
     * This needs to have the same behaviour for duplicate keys as expectedUrls and expectedUrls
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
    public void alreadyExists(String url, File target) {
        success(url, target, null); // todo: should not be null
    }

    @Override
    public void downloaded(String url, File target) {
        success(url, target, ZonedDateTime.now(ZoneOffset.UTC));
    }

    public synchronized void success(String url, File target, ZonedDateTime time) {
        resourceCache.put(url, new DownloadResult(target.getAbsolutePath(), time));
        if (BuildConfig.DEBUG) {
            Log.d("FetcherModule", "[" + currentDownloadCount() + "/" + expectedUrls.size() + "] Downloaded " + url);
        }
        sendProgress();
        tryToResolve();
    }

    private int currentDownloadCount() {
        return errorMessages.size() + resourceCache.size();
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


        WritableMap resourceCache = Arguments.createMap();
        for (Map.Entry<String, DownloadResult> entry : this.resourceCache.entrySet()) {
            WritableMap downloadResult = Arguments.createMap();

            String lastUpdate = null;

            if (entry.getValue().getLastUpdate() != null) {
                lastUpdate = entry.getValue().getLastUpdate().format(DateTimeFormatter.ISO_INSTANT);
            }

            downloadResult.putString("path", entry.getValue().getPath());
            downloadResult.putString("lastUpdate", lastUpdate);

            resourceCache.putMap(entry.getKey(), downloadResult);
        }

        result.putMap("resourceCache", resourceCache);

        Log.d("FetcherModule", "Resolving promise");
        promise.resolve(result);
    }

    private void sendProgress() {
        sendEvent("progress", (double) (errorMessages.size() + resourceCache.size()) / expectedUrls.size());
    }

    private void sendEvent(String eventName, @Nullable Object params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
