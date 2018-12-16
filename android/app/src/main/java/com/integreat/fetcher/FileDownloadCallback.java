package com.integreat.fetcher;

import java.io.File;
import java.io.IOException;

interface FileDownloadCallback {
    void failed(String url, IOException e);

    void downloaded(String url, File target);
}
