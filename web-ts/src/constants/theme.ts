import type { ThemeType } from 'build-configs'

export type HelpersType = {
  removeLinkHighlighting: string
}

export const helpers: HelpersType = {
  removeLinkHighlighting: 'color: inherit; text-decoration: none;'
}

export type { ThemeType }
