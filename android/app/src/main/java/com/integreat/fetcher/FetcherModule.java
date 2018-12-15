package com.integreat.fetcher;

import android.support.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
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
    private OkHttpClient client = new OkHttpClient.Builder().build();

    public FetcherModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void downloadAsync(final ReadableMap urls, final Promise promise) {
        HashMap<String, Object> urlMap = urls.toHashMap();
        ArrayList<String> expectedUrls = new ArrayList<>(urlMap.keySet());
        DownloadResultCollector collector = new DownloadResultCollector(promise, expectedUrls);

        for (Map.Entry<String, Object> entry : urlMap.entrySet()) {
            String url = entry.getKey();
            String targetFileUrl = entry.getValue().toString();
            downloadAsync(url, targetFileUrl, collector);
        }
    }

    private void downloadAsync(final String sourceUrl, String targetFilePath, final FileCallback callback) {
        final File target = new File(targetFilePath);

        if (target.exists()) {
            callback.downloaded(sourceUrl, target);
            return;
        }

        Request request = new Request.Builder().url(sourceUrl).build();
        Call call = client.newCall(request);
        call.enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                callback.failed(sourceUrl, e);
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) {
                try {
                    target.getParentFile().mkdirs();

                    BufferedSink sink = Okio.buffer(Okio.sink(target));
                    sink.writeAll(response.body().source());
                    sink.close();

                    callback.downloaded(sourceUrl, target);
                } catch (IOException e) {
                    callback.failed(sourceUrl, e);
                }
            }
        });
    }

    @Override
    public String getName() {
        return "Fetcher";
    }
}

