package com.integreat.fetcher;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DownloadResultCollector implements FileCallback {
    private final Map<String, String> failedUrls = new HashMap<>();
    private final List<String> succeededUrls = new ArrayList<>();
    private final Promise promise;
    private final List<String> expectedUrls;

    public DownloadResultCollector(Promise promise, List<String> expectedUrls) {
        this.promise = promise;
        this.expectedUrls = expectedUrls;
    }

    @Override
    public void failed(String url, IOException e) {
        failedUrls.put(url, e.getMessage());
        tryToResolve();
    }

    @Override
    public void downloaded(String url, File target) {
        succeededUrls.add(url);
        tryToResolve();
    }

    private void tryToResolve() {
        if (failedUrls.size() + succeededUrls.size() == expectedUrls.size()) {
            WritableMap result = Arguments.createMap();

            WritableArray succeeded = Arguments.createArray();
            for (String url : succeededUrls) {
                succeeded.pushString(url);
            }


            WritableMap failed = Arguments.createMap();
            for (Map.Entry<String, String> entry : failedUrls.entrySet()) {
                failed.putString(entry.getKey(), entry.getValue());
            }

            result.putArray("succeeded", succeeded);
            result.putMap("failed", failed);
            promise.resolve(result);
        }
    }
}
