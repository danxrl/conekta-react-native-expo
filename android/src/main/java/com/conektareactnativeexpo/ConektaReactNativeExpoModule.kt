package com.conektareactnativeexpo

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule

import io.conekta.model.Token;
import io.conekta.model.TokenCard;
import io.conekta.model.TokenResponse;
import io.conekta.TokensApi;

@ReactModule(name = ConektaReactNativeExpoModule.NAME)
class ConektaReactNativeExpoModule(reactContext: ReactApplicationContext) :
  NativeConektaReactNativeExpoSpec(reactContext) {

  override fun getName(): String {
    return NAME
  }

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

    TokensApi instance = new TokensApi();
    instance.setApiKey(pk);

    Token token = new Token();
    TokenCard card = new TokenCard();

    card.setName(name);
    card.setNumber(number);
    card.setCvc(cvc);
    card.setExpMonth(expMonth);
    card.setExpYear(expYear);

    token.setCard(card);

    // Ejecuta fuera del UI thread
    Executors.newSingleThreadExecutor().execute {
    try {
      TokenResponse response = instance.createToken(token, "es");
      if (response.id.isNullOrEmpty()) {
        promise.reject("E_TOKEN", "Token id missing")
      } else {
        val out = Arguments.createMap().apply { putString("id", id) }
        promise.resolve(out)
      }
    } catch (e: Exception) {
      promise.reject("E_FAILED", e.localizedMessage, e)
    }
  }

  companion object {
    const val NAME = "ConektaReactNativeExpo"
  }
}
