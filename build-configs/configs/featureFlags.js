// @flow

export type FeatureFlagsType = {|
  pois: boolean,
  newsStream: boolean
|}

const featureFlags: FeatureFlagsType = {
  pois: false,
  newsStream: false
}

export default featureFlags
