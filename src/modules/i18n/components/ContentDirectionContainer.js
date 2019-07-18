// @flow

import * as React from 'react'
import { I18nManager } from 'react-native'
import { RTL_LANGUAGES } from '../../i18n/components/I18nProvider'
import type { ThemeType } from '../../theme/constants/theme'
import styled, { type StyledComponent } from 'styled-components/native'

export type ContentDirectionContainerPropsType = {|
  language: string, children: React.Node, theme: ThemeType
|}

const DirectionContainer: StyledComponent<ContentDirectionContainerPropsType, {||}, *> = styled.View`
  flex-direction: ${props => RTL_LANGUAGES.includes(props.language) !== I18nManager.isRTL ? 'row-reverse' : 'row'};
`

export default DirectionContainer
