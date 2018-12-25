package com.integreat.fetcher;

import android.support.annotation.NonNull;

import com.facebook.react.bridge.*;

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
                    targetFile.getParentFile().mkdirs();

                    BufferedSink sink = Okio.buffer(Okio.sink(targetFile));
                    sink.writeAll(response.body().source());
                    sink.close();

                    callback.downloaded(sourceUrl, targetFile);
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

