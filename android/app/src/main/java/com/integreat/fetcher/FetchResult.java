package com.integreat.fetcher;

import java.util.Date;

import javax.annotation.Nullable;

public class FetchResult {
    private final String url;
    private final Date lastUpdate;
    private final boolean alreadyExisted;
    private final String errorMessage;

    public FetchResult(String url, Date lastUpdate, boolean alreadyExisted, String errorMessage) {
        this.url = url;
        this.lastUpdate = lastUpdate;
        this.alreadyExisted = alreadyExisted;
        this.errorMessage = errorMessage;
    }

    public String getUrl() {
        return url;
    }

    public Date getLastUpdate() {
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
