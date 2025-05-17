package ru.university.coffee_shop.controller

import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.net.URLDecoder
import java.nio.charset.StandardCharsets
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

@RestController
@RequestMapping("/api")
class TelegramWebAppController(
    @Value("\${BOT_TOKEN}") private val botToken: String
) {

    @CrossOrigin(
        origins = ["*"],
        allowedHeaders = ["X-Telegram-InitData", "Content-Type"]
    )
    @GetMapping("/check-initdata")
    fun checkInitData(
        @RequestHeader("X-Telegram-InitData") initData: String
    ): ResponseEntity<String> {
        return if (isValid(initData, botToken)) {
            ResponseEntity.ok("Valid!")
        } else {
            ResponseEntity.badRequest().body("Invalid init data!")
        }
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
            val value = if (idx > 0 && pair.length > idx + 1) URLDecoder.decode(pair.substring(idx + 1), StandardCharsets.UTF_8) else ""
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
