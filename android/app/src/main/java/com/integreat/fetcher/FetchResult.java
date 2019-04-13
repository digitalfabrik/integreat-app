package com.integreat.fetcher;

import java.time.ZonedDateTime;

import javax.annotation.Nullable;

public class FetchResult {
    private final String url;
    private final ZonedDateTime lastUpdate;
    private final boolean alreadyExisted;
    private final String errorMessage;

    public FetchResult(String url, ZonedDateTime lastUpdate, boolean alreadyExisted, String errorMessage) {
        this.url = url;
        this.lastUpdate = lastUpdate;
        this.alreadyExisted = alreadyExisted;
        this.errorMessage = errorMessage;
    }

    public String getUrl() {
        return url;
    }

    public ZonedDateTime getLastUpdate() {
        return lastUpdate;
    }

    public boolean alreadyExisted() {
        return alreadyExisted;
    }

    @Nullable
    public String getErrorMessage() {
        return errorMessage;
    }
}
