package ru.university.coffee_shop.controller

import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
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
        return if (validateTelegramInitData(initData, botToken)) {
            ResponseEntity.ok("Valid!")
        } else {
            ResponseEntity.badRequest().body("Invalid init data!")
        }
    }

    fun validateTelegramInitData(initData: String, botToken: String): Boolean {
        println(initData)
        val params = initData.split("&")
            .map { it.split("=", limit = 2) }
            .associate { it[0] to (it.getOrNull(1) ?: "") }

        val hash = params["hash"] ?: return false

        val checkParams = params.filterKeys { it != "hash" }
            .toSortedMap()
        println(checkParams)
        val dataCheckString = checkParams.entries.joinToString("\n") { "${it.key}=${it.value}" }

        val secretKey = hmacSha256("WebAppData".toByteArray(), botToken.toByteArray())
        val computedHash = hmacSha256(dataCheckString.toByteArray(), secretKey).joinToString("") { "%02x".format(it) }
        println(computedHash)
        println(hash)
        return computedHash == hash
    }

    fun hmacSha256(data: ByteArray, key: ByteArray): ByteArray {
        val hmacSha256 = "HmacSHA256"
        val mac = Mac.getInstance(hmacSha256)
        val keySpec = SecretKeySpec(key, hmacSha256)
        mac.init(keySpec)
        return mac.doFinal(data)
    }
}
