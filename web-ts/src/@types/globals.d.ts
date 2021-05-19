import { WebBuildConfigType } from 'build-configs'

declare global {
  declare const __VERSION_NAME__: string
  declare const __COMMIT_SHA__: string
  declare const __BUILD_CONFIG_NAME__: string
  declare const __BUILD_CONFIG__: WebBuildConfigType
}
