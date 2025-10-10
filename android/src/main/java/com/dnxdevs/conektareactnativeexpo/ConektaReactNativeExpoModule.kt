package com.dnxdevs.conektareactnativeexpo

import android.provider.Settings
import android.util.Base64
import com.dnxdevs.conektareactnativeexpo.records.TokenCard
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.BufferedWriter
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import java.security.KeyFactory
import java.security.spec.X509EncodedKeySpec
import java.util.UUID
import javax.crypto.Cipher

class ConektaReactNativeExpoModule : Module() {

  override fun definition() = ModuleDefinition {
    Name("ConektaReactNativeExpo")

    AsyncFunction("createToken") { card: TokenCard ->
      validateCard(card)
      val payload = buildPayload(card)
      executeRequest(payload)
    }
  }

  private fun validateCard(card: TokenCard) {
    if (card.name.isBlank() || card.number.isBlank() || card.cvc.isBlank() ||
      card.expMonth.isBlank() || card.expYear.isBlank()
    ) {
      throw InvalidCardException("All card fields are required.")
    }
  }

  private fun buildPayload(card: TokenCard): JSONObject {
    val cardPayload = JSONObject()
      .put("name", encrypt(card.name))
      .put("number", encrypt(card.number))
      .put("cvc", encrypt(card.cvc))
      .put("exp_month", encrypt(card.expMonth))
      .put("exp_year", encrypt(card.expYear))
      .put("device_fingerprint", deviceFingerprint())

    return JSONObject().put("card", cardPayload)
  }

  private fun executeRequest(body: JSONObject): Map<String, Any?> {
    val connection = (URL("$BASE_URL/tokens").openConnection() as HttpURLConnection).apply {
      requestMethod = "POST"
      doOutput = true
      setRequestProperty("Authorization", "Basic ${encodedPublicKey()}")
      setRequestProperty("Content-Type", "application/json")
      setRequestProperty("Accept", "application/vnd.conekta-v0.3.0+json")
      setRequestProperty("Conekta-Client-User-Agent", "{\"agent\":\"Conekta Android SDK\"}")
      connectTimeout = 15000
      readTimeout = 15000
    }

    connection.outputStream.use { outputStream ->
      BufferedWriter(OutputStreamWriter(outputStream)).use { writer ->
        writer.write(body.toString())
        writer.flush()
      }
    }

    val responseStream = if (connection.responseCode in 200..299) {
      connection.inputStream
    } else {
      connection.errorStream
    }

    val responseBody = responseStream?.let {
      BufferedReader(InputStreamReader(it)).use { reader ->
        buildString {
          var line: String?
          while (reader.readLine().also { line = it } != null) {
            append(line)
          }
        }
      }
    } ?: ""

    if (connection.responseCode !in 200..299) {
      val message = responseBody.ifBlank { "Conekta request failed with code ${connection.responseCode}." }
      throw ConektaRequestException(message, connection.responseCode)
    }

    if (responseBody.isBlank()) {
      throw ConektaRequestException("Empty response from Conekta.", connection.responseCode)
    }

    val jsonResponse = JSONObject(responseBody)
    return jsonResponse.toMap()
  }

  private fun encodedPublicKey(): String {
    val key = resolveConfiguredPublicKey()
    return Base64.encodeToString(key.toByteArray(Charsets.UTF_8), Base64.NO_WRAP)
  }

  private fun resolveConfiguredPublicKey(): String {
    val context = appContext.reactContext
      ?: throw MissingPublicKeyException("Unable to resolve ReactContext to read the public key.")
    val value = context.getString(R.string.conekta_public_key)
    if (value.isNullOrBlank()) {
      throw MissingPublicKeyException("Conekta public key not configured. Set it with the config plugin.")
    }
    return value
  }

  private fun deviceFingerprint(): String {
    val context = appContext.reactContext ?: return UUID.randomUUID().toString().replace("-", "")
    val fingerprint = Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID)
    return (fingerprint ?: UUID.randomUUID().toString()).replace("-", "")
  }

  private fun encrypt(value: String): String {
    val cleanKey = PUBLIC_KEY_PEM
      .replace("-----BEGIN PUBLIC KEY-----", "")
      .replace("-----END PUBLIC KEY-----", "")
      .replace("\n", "")

    val decodedKey = Base64.decode(cleanKey, Base64.DEFAULT)
    val keySpec = X509EncodedKeySpec(decodedKey)
    val publicKey = KeyFactory.getInstance("RSA").generatePublic(keySpec)
    val cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding")
    cipher.init(Cipher.ENCRYPT_MODE, publicKey)
    val encrypted = cipher.doFinal(value.toByteArray(Charsets.UTF_8))
    return Base64.encodeToString(encrypted, Base64.NO_WRAP)
  }

  private fun JSONObject.toMap(): Map<String, Any?> {
    val map = mutableMapOf<String, Any?>()
    val keys = keys()
    while (keys.hasNext()) {
      val key = keys.next()
      when (val value = get(key)) {
        is JSONObject -> map[key] = value.toMap()
        is JSONArray -> map[key] = value.toList()
        JSONObject.NULL -> map[key] = null
        else -> map[key] = value
      }
    }
    return map
  }

  private fun JSONArray.toList(): List<Any?> {
    val list = mutableListOf<Any?>()
    for (index in 0 until length()) {
      when (val value = get(index)) {
        is JSONObject -> list.add(value.toMap())
        is JSONArray -> list.add(value.toList())
        JSONObject.NULL -> list.add(null)
        else -> list.add(value)
      }
    }
    return list
  }

  companion object {
    private const val BASE_URL = "https://api.conekta.io"
    private val PUBLIC_KEY_PEM = """
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjet2Jm4iPJTqDlW64tEG
I9/dJTJAcn3OQdHrEwNXCz0/Rewqcv/Hm+V0klsUiS9h2W5CLC42q6wGhtl9Buu5
vefuLVyxc8klEEjrSz/5AgfZ4HvzatbVX0KQhHI1j+caOjatDHM/ih13Rj7HIJFn
AcutRB9vyFiCVluqRhlB9/64sqGtVmxJAir7WJp4TmpPvSEqeGKQIb80Tq+FYY7f
tpMxQpsBT8B6y4Kn95ZfDH72H3yJezs/mExVB3M/OCBg+xt/c3dXp65JsbS482c4
KhkxxHChNn1Y/nZ8kFYzakRGhh0BMqkvkqtAwcQJK1xPx2jRELS1vj7OFfMR+3ms
SQIDAQAB
-----END PUBLIC KEY-----
    """.trimIndent()
  }
}

private class InvalidCardException(message: String) : CodedException(message)
private class MissingPublicKeyException(message: String) : CodedException(message)
private class ConektaRequestException(message: String, val statusCode: Int) : CodedException(message)
