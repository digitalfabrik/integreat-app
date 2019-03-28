package com.integreat.fetcher;

import java.time.ZonedDateTime;

import javax.annotation.Nullable;

public class FetchResult {
    private final String url;
    private final ZonedDateTime lastUpdate;
    private final String errorMessage;

    public FetchResult(String url, ZonedDateTime lastUpdate, String errorMessage) {
        this.url = url;
        this.lastUpdate = lastUpdate;
        this.errorMessage = errorMessage;
    }

    public String getUrl() {
        return url;
    }

    @Nullable
    public ZonedDateTime getLastUpdate() {
        return lastUpdate;
    }

    @Nullable
    public String getErrorMessage() {
        return errorMessage;
    }
}
