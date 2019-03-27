package com.integreat.fetcher;

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

import javax.annotation.Nullable;

public class FetchResultCollector implements FetchedCallback {
    private final Map<String, String> errorMessages = new HashMap<>();
    private final Map<String, FetchResult> fetchResults = new HashMap<>();
    private final Promise promise;
    private final int expectedFetchCount;
    private final ReactContext reactContext;

    public FetchResultCollector(ReactContext reactContext, int expectedFetchCount, Promise promise) {
        this.promise = promise;
        this.expectedFetchCount = expectedFetchCount;
        this.reactContext = reactContext;
    }

    @Override
    public synchronized void failed(String url, String message) {
        errorMessages.put(url, message);

        if (BuildConfig.DEBUG) {
            Log.e("FetcherModule", "[" + currentFetchCount() + "/" + expectedFetchCount + "] Failed to fetch " + url + ": " + message);
        }
        sendProgress();
        tryToResolve();
    }

    @Override
    public void alreadyExists(String url, File targetFile) {
        success(url, targetFile, null); // todo: should not be null
    }

    @Override
    public void fetched(String url, File targetFile) {
        success(url, targetFile, ZonedDateTime.now(ZoneOffset.UTC));
    }

    private synchronized void success(String url, File targetFile, ZonedDateTime time) {
        fetchResults.put(targetFile.getAbsolutePath(), new FetchResult(url, time));
        if (BuildConfig.DEBUG) {
            Log.d("FetcherModule", "[" + currentFetchCount() + "/" + expectedFetchCount + "] Fetched " + url);
        }
        sendProgress();
        tryToResolve();
    }

    private int currentFetchCount() {
        return errorMessages.size() + fetchResults.size();
    }

    private void tryToResolve() {
        if (currentFetchCount() != expectedFetchCount) {
            return;
        }

        WritableMap resolveValue = Arguments.createMap();

        WritableMap failed = Arguments.createMap();
        for (Map.Entry<String, String> entry : errorMessages.entrySet()) {
            failed.putString(entry.getKey(), entry.getValue());
        }

        resolveValue.putMap("failureMessages", failed);


        WritableMap resourceCache = Arguments.createMap();
        for (Map.Entry<String, FetchResult> entry : this.fetchResults.entrySet()) {
            WritableMap fetchResult = Arguments.createMap();
            FetchResult result = entry.getValue();
            ZonedDateTime dateTime = result.getLastUpdate();

            fetchResult.putString("url", result.getUrl());

            if (dateTime != null) {
                // If the file already existed then lastUpdate should be "undefined"
                fetchResult.putString("lastUpdate", dateTime.format(DateTimeFormatter.ISO_INSTANT));
            }

            resourceCache.putMap(entry.getKey(), fetchResult);
        }

        resolveValue.putMap("fetchedUrls", resourceCache);

        Log.d("FetcherModule", "Resolving promise");
        promise.resolve(resolveValue);
    }

    private void sendProgress() {
        sendEvent("progress", (double) (errorMessages.size() + fetchResults.size()) / expectedFetchCount);
    }

    private void sendEvent(String eventName, @Nullable Object params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
