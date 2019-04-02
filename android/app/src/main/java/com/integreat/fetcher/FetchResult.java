package com.integreat.fetcher;

import java.time.ZonedDateTime;

public class FetchResult {
    private final String url;
    private final ZonedDateTime lastUpdate;
    private final boolean alreadyExisted;

    public FetchResult(String url, ZonedDateTime lastUpdate, boolean alreadyExisted) {
        this.url = url;
        this.lastUpdate = lastUpdate;
        this.alreadyExisted = alreadyExisted;
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
}
