package tuerantuer.app.integreat.fetcher

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import tuerantuer.app.integreat.BuildConfig
import java.io.File
import java.text.DateFormat
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

class FetchResultCollector(
    private val reactContext: ReactContext,
    private val expectedFetchCount: Int,
    private val promise: Promise
) : FetchedCallback {
    private val fetchResults: MutableMap<String, FetchResult> = HashMap()
    private val iso8601Format: DateFormat

    init {
        val timezone = TimeZone.getTimeZone("UTC")
        iso8601Format = SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'", Locale.ENGLISH)
        iso8601Format.setTimeZone(timezone)
    }

    @Synchronized
    override fun failed(url: String?, targetFile: File?, message: String?) {
        fetchResults[targetFile!!.absolutePath] = FetchResult(
            url!!, Date(), false, message!!
        )
        if (BuildConfig.DEBUG) {
            Log.e(
                "FetcherModule",
                "[" + currentFetchCount() + "/" + expectedFetchCount + "] Failed to fetch " + url + ": " + message
            )
        }
        sendProgress()
        tryToResolve()
    }

    override fun alreadyExists(url: String?, targetFile: File?) {
        success(url, targetFile, true)
    }

    override fun fetched(url: String?, targetFile: File?) {
        success(url, targetFile, false)
    }

    @Synchronized
    private fun success(url: String?, targetFile: File?, alreadyExisted: Boolean) {
        fetchResults[targetFile!!.absolutePath] = FetchResult(
            url!!, Date(), alreadyExisted, null
        )
        if (BuildConfig.DEBUG) {
            Log.d(
                "FetcherModule",
                "[" + currentFetchCount() + "/" + expectedFetchCount + "] Fetched " + url
            )
        }
        sendProgress()
        tryToResolve()
    }

    private fun currentFetchCount(): Int {
        return fetchResults.size
    }

    private fun tryToResolve() {
        if (currentFetchCount() != expectedFetchCount) {
            return
        }
        val resolveValue = Arguments.createMap()
        for ((filePath, result) in fetchResults) {
            val fetchResult = Arguments.createMap()
            fetchResult.putString("url", result.url)
            if (result.alreadyExisted()) {
                // If the file already existed then lastUpdate should be "undefined"
                fetchResult.putString("lastUpdate", iso8601Format.format(result.lastUpdate))
            }
            if (result.getErrorMessage() != null) {
                fetchResult.putString("errorMessage", result.getErrorMessage())
            }
            resolveValue.putMap(filePath, fetchResult)
        }
        Log.d("FetcherModule", "Resolving promise")
        promise.resolve(resolveValue)
    }

    private fun sendProgress() {
        sendEvent("progress", fetchResults.size.toDouble() / expectedFetchCount)
    }

    private fun sendEvent(eventName: String, params: Any?) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}
