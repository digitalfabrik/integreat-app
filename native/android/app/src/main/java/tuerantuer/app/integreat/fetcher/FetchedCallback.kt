package tuerantuer.app.integreat.fetcher

import java.io.File

internal interface FetchedCallback {
    fun failed(url: String?, targetFile: File?, message: String?)
    fun fetched(url: String?, targetFile: File?)
    fun alreadyExists(url: String?, targetFile: File?)
}
