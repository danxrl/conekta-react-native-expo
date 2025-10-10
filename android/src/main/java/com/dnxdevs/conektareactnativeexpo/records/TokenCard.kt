package com.dnxdevs.conektareactnativeexpo.records

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class TokenCard : Record {
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
