package tuerantuer.app.integreat.fetcher

import java.util.Date

class FetchResult(
    @JvmField val url: String,
    @JvmField val lastUpdate: Date,
    private val alreadyExisted: Boolean,
    private val errorMessage: String?
) {
    fun alreadyExisted(): Boolean {
        return alreadyExisted
    }

    fun getErrorMessage(): String? {
        return errorMessage
    }
}
