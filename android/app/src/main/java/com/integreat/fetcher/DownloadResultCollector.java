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

public class DownloadResultCollector implements FileDownloadCallback {
    private final Map<String, String> errorMessages = new HashMap<>();
    private final Map<String, DownloadResult> downloadedUrls = new HashMap<>();
    private final Promise promise;
    private final int expectedDownloads;
    private final ReactContext reactContext;

    public DownloadResultCollector(ReactContext reactContext, int expectedDownloads, Promise promise) {
        this.promise = promise;
        this.expectedDownloads = expectedDownloads;
        this.reactContext = reactContext;
    }

    @Override
    public synchronized void failed(String url, String message) {
        errorMessages.put(url, message);

        if (BuildConfig.DEBUG) {
            Log.e("FetcherModule", "[" + currentDownloadCount() + "/" + expectedDownloads + "] Failed to download " + url + ": " + message);
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

    public synchronized void success(String url, File targetFile, ZonedDateTime time) {
        downloadedUrls.put(targetFile.getAbsolutePath(), new DownloadResult(url, time));
        if (BuildConfig.DEBUG) {
            Log.d("FetcherModule", "[" + currentDownloadCount() + "/" + expectedDownloads + "] Downloaded " + url);
        }
        sendProgress();
        tryToResolve();
    }

    private int currentDownloadCount() {
        return errorMessages.size() + downloadedUrls.size();
    }

    private void tryToResolve() {
        if (currentDownloadCount() != expectedDownloads) {
            return;
        }

        WritableMap resolveValue = Arguments.createMap();

        WritableMap failed = Arguments.createMap();
        for (Map.Entry<String, String> entry : errorMessages.entrySet()) {
            failed.putString(entry.getKey(), entry.getValue());
        }

        resolveValue.putMap("failureMessages", failed);


        WritableMap resourceCache = Arguments.createMap();
        for (Map.Entry<String, DownloadResult> entry : this.downloadedUrls.entrySet()) {
            WritableMap downloadResult = Arguments.createMap();
            DownloadResult result = entry.getValue();
            ZonedDateTime dateTime = result.getLastUpdate();

            downloadResult.putString("url", result.getUrl());

            if (dateTime != null) {
                // If the file already existed then lastUpdate should be "undefined"
                downloadResult.putString("lastUpdate", dateTime.format(DateTimeFormatter.ISO_INSTANT));
            }

            resourceCache.putMap(entry.getKey(), downloadResult);
        }

        resolveValue.putMap("resourceCache", resourceCache);

        Log.d("FetcherModule", "Resolving promise");
        promise.resolve(resolveValue);
    }

    private void sendProgress() {
        sendEvent("progress", (double) (errorMessages.size() + downloadedUrls.size()) / expectedDownloads);
    }

    private void sendEvent(String eventName, @Nullable Object params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
