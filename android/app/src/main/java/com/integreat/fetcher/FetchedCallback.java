package com.integreat.fetcher;

import java.io.File;

interface FetchedCallback {
    void failed(String url, File targetFile, String message);

    void fetched(String url, File targetFile);

    void alreadyExists(String url, File targetFile);
}
