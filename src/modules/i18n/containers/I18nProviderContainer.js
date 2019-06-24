// @flow

import * as React from 'react'
import setUiDirection from '../actions/setUIDirection'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../app/StoreActionType'
import { connect } from 'react-redux'
import { I18nProvider } from '../components/I18nProvider'
import type { UiDirectionType } from '../actions/setUIDirection'

type OwnPropsType = {| children?: React.Node |}

type DispatchPropsType = {| setUiDirection: (direction: UiDirectionType) => void |}

type PropsType = {| ...OwnPropsType, ...DispatchPropsType |}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({
  setUiDirection: (direction: UiDirectionType) => {
    dispatch(setUiDirection(direction))
  }
})

export default connect<PropsType, OwnPropsType, _, _, _, _>(() => ({}), mapDispatchToProps)(I18nProvider)
