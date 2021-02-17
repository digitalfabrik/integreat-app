// flow-typed signature: a10290b1d1ff426bfb194fa5c1b34868
// flow-typed version: <<STUB>>/react-i18next_v11.8.5/flow_v0.122.0

import type { ThemeType } from 'build-configs/ThemeType'

/**
 * This is an autogenerated libdef stub for:
 *
 *   'react-i18next'
 *
 * Fill this stub out by replacing all the `any` types.
 *
 * Once filled out, we encourage you to share your work with the
 * community by sending a pull request to:
 * https://github.com/flowtype/flow-typed
 */

declare module 'react-i18next' {
  declare type i18nType = any
  declare export type TFunction = (key: string, options?: {}) => string
  declare export function useTranslation(namespace: string | Array<string>): {
    t: TFunction,
    i18n: i18nType
  }
  declare export function withTranslation<Props: { ... }>(namespace: string | Array<string>): ((React$ComponentType<Props>) => React$ComponentType<$Diff<Props, {| t: TFunction |}>>)
  declare export class I18nextProvider extends React$Component<{i18n: i18nType}> {}
  declare export class Translation extends React$Component<{| children: any |}> {}
}
