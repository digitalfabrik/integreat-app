declare module 'react-i18next' {
  declare type I18nType = {| language: string, languages: string[] |}
  declare export type TFunction = (key: string, options?: {}) => string
  declare export function useTranslation(namespace?: string | Array<string>): {
    t: TFunction,
    i18n: I18nType
  }
  declare export function withTranslation<Props: { ... }>(namespace?: string | Array<string>): ((React$ComponentType<Props>) => React$ComponentType<$Diff<Props, {| t: TFunction |}>>)
  declare export class I18nextProvider extends React$Component<{i18n: I18nType}> {}
  declare type TranslationPropsType = {
    children: (
      t: TFunction,
      options: {
        i18n: i18n,
        lng: string
      },
      ready: boolean
    ) => React$Node
  }
  declare export function Translation(props: TranslationPropsType): any
}
