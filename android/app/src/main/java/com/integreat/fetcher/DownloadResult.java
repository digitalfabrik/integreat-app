package com.integreat.fetcher;

import java.time.ZonedDateTime;

public class DownloadResult {
    private final String path;
    private final ZonedDateTime lastUpdate;

    public DownloadResult(String path, ZonedDateTime lastUpdate) {
        this.path = path;
        this.lastUpdate = lastUpdate;
    }

    public String getPath() {
        return path;
    }

    public ZonedDateTime getLastUpdate() {
        return lastUpdate;
    }
}
