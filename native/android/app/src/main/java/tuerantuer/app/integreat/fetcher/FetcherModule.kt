package tuerantuer.app.integreat.fetcher

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import okhttp3.Call
import okhttp3.Callback
import okhttp3.OkHttpClient
import okhttp3.OkHttpClient.Builder
import okhttp3.Request.Builder as RequestBuilder
import okhttp3.Request
import okhttp3.Response
import okio.buffer
import okio.sink
import java.io.File
import java.io.IOException

class FetcherModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    private val client: OkHttpClient = Builder().build()
    private val cacheDir: File

    init {
        cacheDir = reactContext.cacheDir
    }

    @ReactMethod
    fun fetchAsync(urls: ReadableMap, promise: Promise) {
        val urlMap = urls.toHashMap()
        val expectedFetchCount = urlMap.size
        val collector = FetchResultCollector(
            reactApplicationContext,
            expectedFetchCount, promise
        )
        for ((targetFilePath, value) in urlMap) {
            val url = value.toString()
            fetchAsync(url, targetFilePath, collector)
        }
    }

    private fun fetchAsync(sourceUrl: String, targetFilePath: String, callback: FetchedCallback) {
        val targetFile = File(targetFilePath)
        if (targetFile.exists()) {
            callback.alreadyExists(sourceUrl, targetFile)
            return
        }
        try {
            val request: Request = RequestBuilder().url(sourceUrl).build()
            val call = client.newCall(request)
            call.enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    callback.failed(sourceUrl, targetFile, e.message)
                }

                override fun onResponse(call: Call, response: Response) {
                    if (!response.isSuccessful) {
                        callback.failed(
                            sourceUrl,
                            targetFile,
                            response.code.toString() + ": " + response.message
                        )
                        return
                    }
                    try {
                        val outputFile = File.createTempFile("resource", ".partial", cacheDir)
                        val sink = outputFile.sink().buffer()
                        sink.writeAll(response.body!!.source())
                        sink.close()
                        val parent = targetFile.parentFile
                        if (!parent.exists() && !parent.mkdirs()) {
                            callback.failed(
                                sourceUrl,
                                targetFile,
                                "Failed to create parent directories."
                            )
                            return
                        }
                        if (!outputFile.renameTo(targetFile)) {
                            callback.failed(
                                sourceUrl,
                                targetFile,
                                "Failed to move downloaded file to target location."
                            )
                            return
                        }
                        callback.fetched(sourceUrl, targetFile)
                    } catch (e: IOException) {
                        callback.failed(sourceUrl, targetFile, e.message)
                    }
                }
            })
        } catch (e: Exception) {
            callback.failed(sourceUrl, targetFile, e.message)
        }
    }

    override fun getName(): String {
        return "Fetcher"
    }
}
