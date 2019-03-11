package com.integreat.fetcher;

import android.support.annotation.NonNull;
import android.util.Log;

import com.facebook.react.bridge.*;

import okhttp3.Callback;
import okhttp3.*;
import okio.BufferedSink;
import okio.Okio;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

public class FetcherModule extends ReactContextBaseJavaModule {
    private OkHttpClient client = new OkHttpClient.Builder().build();

    public FetcherModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void downloadAsync(final ReadableMap urls, final Promise promise) {
        HashMap<String, Object> urlMap = urls.toHashMap();
        HashSet<String> expectedUrls = new HashSet<>(urlMap.keySet());
        DownloadResultCollector collector = new DownloadResultCollector(getReactApplicationContext(), expectedUrls, promise);

        for (Map.Entry<String, Object> entry : urlMap.entrySet()) {
            String url = entry.getKey();
            String targetFilePath = entry.getValue().toString();
            downloadAsync(url, targetFilePath, collector);
        }
    }

    private void downloadAsync(final String sourceUrl, String targetFilePath, final FileDownloadCallback callback) {
        final File targetFile = new File(targetFilePath);

        if (targetFile.exists()) {
            callback.downloaded(sourceUrl, targetFile);
            return;
        }

        try {
            Request request = new Request.Builder().url(sourceUrl).build();
            Call call = client.newCall(request);
            call.enqueue(new Callback() {
                @Override
                public void onFailure(@NonNull Call call, @NonNull IOException e) {
                    callback.failed(sourceUrl, e.getMessage());
                }

                @Override
                public void onResponse(@NonNull Call call, @NonNull Response response) {
                    if (!response.isSuccessful()) {
                        callback.failed(sourceUrl, response.message());
                        return;
                    }

                    try {
                        targetFile.getParentFile().mkdirs();

                        BufferedSink sink = Okio.buffer(Okio.sink(targetFile));
                        sink.writeAll(response.body().source());
                        sink.close();

                        callback.downloaded(sourceUrl, targetFile);
                    } catch (IOException e) {
                        callback.failed(sourceUrl, e.getMessage());
                    }
                }
            });
        } catch (Exception e) {
            callback.failed(sourceUrl, e.getMessage());
        }
    }

    @Override
    public String getName() {
        return "Fetcher";
    }
}

