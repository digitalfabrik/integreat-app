package com.integreat.fetcher;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
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
    public synchronized void failed(String url, File targetFile, String message) {
        fetchResults.put(targetFile.getAbsolutePath(), new FetchResult(url, null, message));

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
        fetchResults.put(targetFile.getAbsolutePath(), new FetchResult(url, time, null));
        if (BuildConfig.DEBUG) {
            Log.d("FetcherModule", "[" + currentFetchCount() + "/" + expectedFetchCount + "] Fetched " + url);
        }
        sendProgress();
        tryToResolve();
    }

    private int currentFetchCount() {
        return fetchResults.size();
    }

    private void tryToResolve() {
        if (currentFetchCount() != expectedFetchCount) {
            return;
        }

        WritableMap resolveValue = Arguments.createMap();
        for (Map.Entry<String, FetchResult> entry : this.fetchResults.entrySet()) {
            WritableMap fetchResult = Arguments.createMap();
            FetchResult result = entry.getValue();
            ZonedDateTime dateTime = result.getLastUpdate();

            fetchResult.putString("url", result.getUrl());

            if (dateTime != null) {
                // If the file already existed then lastUpdate should be "undefined"
                fetchResult.putString("lastUpdate", dateTime.format(DateTimeFormatter.ISO_INSTANT));
            }

            if (result.getErrorMessage() != null) {
                fetchResult.putString("errorMessage", result.getErrorMessage());
            }

            resolveValue.putMap(entry.getKey(), fetchResult);
        }

        Log.d("FetcherModule", "Resolving promise");
        promise.resolve(resolveValue);
    }

    private void sendProgress() {
        sendEvent("progress", (double) (fetchResults.size()) / expectedFetchCount);
    }

    private void sendEvent(String eventName, @Nullable Object params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
