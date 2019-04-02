package com.integreat.fetcher;

import java.io.File;
import java.io.IOException;

interface FetchedCallback {
    void failed(String url, String message);

    void fetched(String url, File targetFile);

    void alreadyExists(String url, File targetFile);
}
