import ExpoModulesCore

private struct TokenCardInput: Record {
  @Field
  var name: String = ""

  @Field
  var number: String = ""

  @Field
  var cvc: String = ""

  @Field
  var expMonth: String = ""

  @Field
  var expYear: String = ""
}

private enum ConektaBridgeError: Error, LocalizedError {
  case missingPublicKey
  case invalidField(String)
  case tokenInstantiation

  var errorDescription: String? {
    switch self {
    case .missingPublicKey:
      return "Conekta public key not configured. Set it through the config plugin."
    case .invalidField(let field):
      return "Invalid value received for card field \"\(field)\"."
    case .tokenInstantiation:
      return "Unable to prepare Conekta token resources."
    }
  }
}

public class ConektaReactNativeExpoModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ConektaReactNativeExpo")

    AsyncFunction("createToken") { (card: TokenCardInput) -> [String: Any] in
      try self.validate(card: card)
      let publicKey = try self.resolvePublicKey()

      let conekta = Conekta()
      conekta.publicKey = publicKey
      conekta.collectDevice()

      guard let cardInstance = conekta.card() else {
        throw ConektaBridgeError.tokenInstantiation
      }
      cardInstance.setNumber(
        card.number,
        name: card.name,
        cvc: card.cvc,
        expMonth: card.expMonth,
        expYear: card.expYear
      )

      guard let token = conekta.token() else {
        throw ConektaBridgeError.tokenInstantiation
      }
      token.card = cardInstance

      return try await withCheckedThrowingContinuation { continuation in
        token.create(success: { response in
          if let dictionary = response as? [String: Any] {
            continuation.resume(returning: dictionary)
          } else {
            continuation.resume(returning: [:])
          }
        }, andError: { error in
          if let wrapped = error {
            continuation.resume(throwing: wrapped)
          } else {
            continuation.resume(throwing: ConektaBridgeError.tokenInstantiation)
          }
        })
      }
    }
  }

  private func validate(card: TokenCardInput) throws {
    if card.name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
      throw ConektaBridgeError.invalidField("name")
    }
    if card.number.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
      throw ConektaBridgeError.invalidField("number")
    }
    if card.cvc.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
      throw ConektaBridgeError.invalidField("cvc")
    }
    if card.expMonth.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
      throw ConektaBridgeError.invalidField("expMonth")
    }
    if card.expYear.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
      throw ConektaBridgeError.invalidField("expYear")
    }
  }

  private func resolvePublicKey() throws -> String {
    if let configured = Bundle.main.object(forInfoDictionaryKey: "ConektaPublicKey") as? String,
       configured.isEmpty == false {
      return configured
    }
    throw ConektaBridgeError.missingPublicKey
  }
}
