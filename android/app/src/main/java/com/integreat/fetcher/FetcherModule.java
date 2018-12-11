package com.integreat.fetcher;

import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okio.BufferedSink;
import okio.Okio;

import static com.facebook.react.common.ReactConstants.TAG;

public class FetcherModule extends ReactContextBaseJavaModule {
    private interface FileCallback {
        void failed(String url);

        void downloaded(String url, File target);
    }

    private OkHttpClient client = new OkHttpClient.Builder().build();

    public FetcherModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

//    @ReactMethod
//    public void fetch(
//            int tag,
//            int ancestorTag,
//            Promise promise) {
//        WritableMap map = Arguments.createMap();
//
//        promise.resolve(map);
//    }

    @ReactMethod
    public void downloadAsync(final ReadableMap urls, final Promise promise) {
        try {
            final List<Uri> targets = new ArrayList<>();
            final ArrayList<String> failed = new ArrayList<>();

            final HashMap<String, Object> urlMap = urls.toHashMap();
            for (Map.Entry<String, Object> entry : urlMap.entrySet()) {
                downloadAsync(entry.getKey(), entry.getValue().toString(), new FileCallback() {
                    @Override
                    public void failed(String url) {
                        failed.add(url);

                        if (targets.size() + failed.size() == urlMap.size()) {
                            Bundle result = new Bundle();
                            result.putStringArrayList("failed", failed);
                            promise.resolve(result);
                        }
                    }

                    @Override
                    public void downloaded(String url, File target) {
                        targets.add(Uri.fromFile(target));

                        if (targets.size() + failed.size() == urlMap.size()) {
                            WritableMap result = Arguments.createMap();
                            WritableArray array = Arguments.createArray();
                            for (String fail : failed) {
                                array.pushString(fail);
                            }
                            result.putArray("failed", array);
                            promise.resolve(result);
                        }
                    }
                });
            }
        } catch (IOException e) {
            Log.e(TAG, e.getMessage());
            promise.reject(e);
        }
    }


    // https://github.com/expo/expo/blob/master/packages/expo-file-system/android/src/main/java/expo/modules/filesystem/FileSystemModule.java
    public void downloadAsync(String url, final String uriStr, final FileCallback callback) throws IOException {
        final Uri uri = Uri.parse(uriStr);
        if (!"file".equals(uri.getScheme())) {
            throw new IOException("Unsupported scheme for location '" + uri + "'.");
        }

        Request request = new Request.Builder().url(url).build();
        Call call = client.newCall(request);
        call.enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                callback.failed(call.request().url().toString());
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                String url = response.request().url().toString();

                File file = new File(Objects.requireNonNull(uri.getPath()));
                file.delete();

                BufferedSink sink = Okio.buffer(Okio.sink(file));
                sink.writeAll(response.body().source());
                sink.close();
                callback.downloaded(url, file);
            }
        });
    }

    @Override
    public String getName() {
        return "Fetcher";
    }
}

