#import "ConektaReactNativeExpo.h"

#import "Conekta/Conekta.h"

@implementation ConektaReactNativeExpo
- (void)createCardToken:(NSDictionary *)input
               resolver:(RCTPromiseResolveBlock)resolve
               rejecter:(RCTPromiseRejectBlock)reject
{
  NSString *pk = input[@"publicKey"];
  if (pk == nil) {
    reject(@"E_PK",
           @"Missing publicKey",
           nil); return;
  }
  
  NSString *name = input[@"name"] ?: @"";
  NSString *number = input[@"number"] ?: @"";
  NSString *cvc = input[@"cvc"] ?: @"";
  NSString *expMonth = input[@"expMonth"] ?: @"";
  NSString *expYear = input[@"expYear"] ?: @"";
  
  Conekta *conekta = [[Conekta alloc] init];
  [conekta setDelegate: self];
  [conekta setPublicKey:@"key_KJysdbf6PotS2ut2"];
  [conekta collectDevice];
  
  Card *card = [conekta.Card initWithNumber:number name:name cvc:cvc expMonth:expMonth expYear:expYear];
  Token *token = [conekta.Token initWithCard:card];
  
  [token createWithSuccess: ^(NSDictionary *data) {
    NSString *tid = data[@"id"] ?: @"";
    if (tid.length == 0) {
      reject(@"E_TOKEN",
             @"Token id missing",
             nil);
      return;
    }
    resolve(@{ @"id": tid });
  } andError: ^(NSError *error) {
    RCTLogError(@"Conekta token error: %@",
                error);
    reject(@"E_FAILED",
           error.localizedDescription,
           error);
  }];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeConektaReactNativeExpoSpecJSI>(params);
}

+ (NSString *)moduleName
{
  return @"ConektaReactNativeExpo";
}

@end
