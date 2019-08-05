// @flow

import * as React from 'react'
import type { Dispatch } from 'redux'
import type { SetContentLanguageActionType, StoreActionType } from '../../app/StoreActionType'
import { connect } from 'react-redux'
import I18nProvider from '../components/I18nProvider'

type OwnPropsType = {| children?: React.Node |}

type DispatchPropsType = {|
  setContentLanguage: (language: string) => void
|}

type PropsType = {| ...OwnPropsType, ...DispatchPropsType |}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({
  setContentLanguage: (language: string) => {
    const setContentLanguageAction: SetContentLanguageActionType = {
      type: 'SET_CONTENT_LANGUAGE',
      params: {
        contentLanguage: language
      }
    }
    dispatch(setContentLanguageAction)
  }
})

export default connect<PropsType, OwnPropsType, _, _, _, _>(undefined, mapDispatchToProps)(I18nProvider)
