#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(FetcherModule, RCTEventEmitter)
RCT_EXTERN_METHOD(
                  fetchAsync: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
)
@end
