package com.integreat.fetcher;

import java.time.ZonedDateTime;

public class FetchResult {
    private final String url;
    private final ZonedDateTime lastUpdate;

    public FetchResult(String url, ZonedDateTime lastUpdate) {
        this.url = url;
        this.lastUpdate = lastUpdate;
    }

    public String getUrl() {
        return url;
    }

    public ZonedDateTime getLastUpdate() {
        return lastUpdate;
    }
}
