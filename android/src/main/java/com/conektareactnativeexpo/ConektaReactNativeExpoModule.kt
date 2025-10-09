package com.conektareactnativeexpo

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.Arguments
import com.facebook.react.module.annotations.ReactModule
import java.util.concurrent.Executors

import io.conekta.model.Token
import io.conekta.model.TokenCard
import io.conekta.model.TokenResponse
import io.conekta.TokensApi

@ReactModule(name = ConektaReactNativeExpoModule.NAME)
class ConektaReactNativeExpoModule(reactContext: ReactApplicationContext) :
  NativeConektaReactNativeExpoSpec(reactContext) {

  override fun getName(): String = NAME

  override fun createCardToken(input: ReadableMap, promise: Promise) {
    val publicKey = input.getString("publicKey") ?: run {
      promise.reject("E_PK", "Missing publicKey")
      return
    }

    val name = input.getString("name") ?: ""
    val number = input.getString("number") ?: ""
    val cvc = input.getString("cvc") ?: ""
    val expMonth = input.getString("expMonth") ?: ""
    val expYear = input.getString("expYear") ?: ""

    val instance = TokensApi()
    instance.setApiKey(publicKey)

    val token = Token()
    val card = TokenCard()

    card.name = name
    card.number = number
    card.cvc = cvc
    card.expMonth = expMonth
    card.expYear = expYear

    token.card = card

    Executors.newSingleThreadExecutor().execute {
      try {
        val response = instance.createToken(token, "es")
        val tokenId = response.id
        if (tokenId.isNullOrEmpty()) {
          promise.reject("E_TOKEN", "Token id missing")
        } else {
          val out = Arguments.createMap().apply { 
            putString("id", tokenId) 
          }
          promise.resolve(out)
        }
      } catch (e: Exception) {
        promise.reject("E_FAILED", e.localizedMessage, e)
      }
    }
  }

  companion object {
    const val NAME = "ConektaReactNativeExpo"
  }
}
