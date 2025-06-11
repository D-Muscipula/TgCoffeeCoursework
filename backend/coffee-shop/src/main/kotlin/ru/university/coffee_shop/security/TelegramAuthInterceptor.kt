package ru.university.coffee_shop.security

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.web.servlet.HandlerInterceptor
import java.net.URLDecoder
import java.nio.charset.StandardCharsets
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

@Component
class TelegramAuthInterceptor(
    @Value("\${BOT_TOKEN}")
    private val botToken: String
) : HandlerInterceptor {
    override fun preHandle(
        request: HttpServletRequest,
        response: HttpServletResponse,
        handler: Any
    ): Boolean {
        println("Intercepting request to: ${request.requestURI}")
        val initData = request.getHeader("X-Telegram-InitData")
        println("HEADER: X-Telegram-InitData = $initData")

        if (initData == null || initData.isEmpty()) {
            println("No X-Telegram-InitData header found")
            response.sendError(HttpServletResponse.SC_NOT_ACCEPTABLE, "Missing X-Telegram-InitData header")
            return false
        }

        if (!isValid(initData, botToken)) {
            println("Invalid Telegram init data")
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid Telegram init data")
            return false
        }

        val params = parseQueryString(initData)
        val user = params["user"]
        user?.let {
            val mapper = jacksonObjectMapper()
            val userMap: Map<String, Any> = mapper.readValue(user)
            val id = userMap["id"]
            id?.let {
                request.setAttribute("telegramUserId", it)
            }
        }
        return true
    }

    fun isValid(telegramInitData: String, botToken: String): Boolean {
        val (hash, initData) = parseInitData(telegramInitData)
        val secretKey = hmacSha256("WebAppData".toByteArray(), botToken.toByteArray())
        val initDataHash = hmacSha256Hex(initData.toByteArray(), secretKey)
        return initDataHash == hash
    }

    private fun parseInitData(telegramInitData: String): Pair<String, String> {
        val initData = parseQueryString(telegramInitData).toMutableMap()
        val hash = initData.remove("hash") ?: ""
        val separatedData = initData.entries
            .sortedBy { it.key }
            .map { "${it.key}=${it.value}" }
        return hash to separatedData.joinToString("\n")
    }

    private fun parseQueryString(queryString: String): Map<String, String> {
        val parameters = mutableMapOf<String, String>()
        val pairs = queryString.split("&")
        for (pair in pairs) {
            val idx = pair.indexOf("=")
            val key = if (idx > 0) URLDecoder.decode(pair.substring(0, idx), StandardCharsets.UTF_8) else pair
            val value = if (idx > 0 && pair.length > idx + 1) URLDecoder.decode(
                pair.substring(idx + 1),
                StandardCharsets.UTF_8
            ) else ""
            parameters[key] = value
        }
        return parameters
    }

    private fun hmacSha256(key: ByteArray, data: ByteArray): ByteArray {
        val hmacSha256 = "HmacSHA256"
        val mac = Mac.getInstance(hmacSha256)
        val keySpec = SecretKeySpec(key, hmacSha256)
        mac.init(keySpec)
        return mac.doFinal(data)
    }

    private fun hmacSha256Hex(data: ByteArray, key: ByteArray): String {
        return hmacSha256(key, data).joinToString("") { "%02x".format(it) }
    }
}
