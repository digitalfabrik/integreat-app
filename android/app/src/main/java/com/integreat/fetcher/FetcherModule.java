package com.integreat.fetcher;

import android.support.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okio.BufferedSink;
import okio.Okio;

public class FetcherModule extends ReactContextBaseJavaModule {
    private final OkHttpClient client = new OkHttpClient.Builder().build();
    private final File cacheDir;

    public FetcherModule(ReactApplicationContext reactContext) {
        super(reactContext);

        this.cacheDir = reactContext.getCacheDir();
    }

    @ReactMethod
    public void fetchAsync(final ReadableMap urls, final Promise promise) {
        HashMap<String, Object> urlMap = urls.toHashMap();
        int expectedFetchCount = urlMap.size();
        FetchResultCollector collector = new FetchResultCollector(
                getReactApplicationContext(),
                expectedFetchCount, promise
        );


        for (Map.Entry<String, Object> entry : urlMap.entrySet()) {
            String targetFilePath = entry.getKey();
            String url = entry.getValue().toString();
            fetchAsync(url, targetFilePath, collector);
        }
    }

    private void fetchAsync(final String sourceUrl, final String targetFilePath, final FetchedCallback callback) {
        final File targetFile = new File(targetFilePath);

        if (targetFile.exists()) {
            callback.alreadyExists(sourceUrl, targetFile);
            return;
        }

        try {
            Request request = new Request.Builder().url(sourceUrl).build();
            Call call = client.newCall(request);
            call.enqueue(new Callback() {
                @Override
                public void onFailure(@NonNull Call call, @NonNull IOException e) {
                    callback.failed(sourceUrl, targetFile, e.getMessage());
                }

                @Override
                public void onResponse(@NonNull Call call, @NonNull Response response) {
                    if (!response.isSuccessful()) {
                        callback.failed(sourceUrl, targetFile, response.code() + ": " + response.message());
                        return;
                    }

                    try {
                        File outputFile = File.createTempFile("resource", ".partial", cacheDir);

                        BufferedSink sink = Okio.buffer(Okio.sink(outputFile));
                        sink.writeAll(response.body().source());
                        sink.close();

                        File parent = targetFile.getParentFile();

                        if (!parent.exists() && !parent.mkdirs()) {
                            callback.failed(sourceUrl, targetFile, "Failed to create parent directories.");
                            return;
                        }

                        if (!outputFile.renameTo(targetFile)) {
                            callback.failed(sourceUrl, targetFile, "Failed to move downloaded file to target location.");
                            return;
                        }
                        callback.fetched(sourceUrl, targetFile);
                    } catch (IOException e) {
                        callback.failed(sourceUrl, targetFile, e.getMessage());
                    }
                }
            });
        } catch (Exception e) {
            callback.failed(sourceUrl, targetFile, e.getMessage());
        }
    }

    @Override
    public String getName() {
        return "Fetcher";
    }
}

