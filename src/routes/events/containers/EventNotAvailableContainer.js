// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { EventRouteStateType, StateType } from '../../../modules/app/StateType'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import EventNotAvailable from '../components/EventNotAvailable'
import { withTheme } from 'styled-components/native'

const mapStateToProps = (state: StateType, ownProps) => {
  const key: string = ownProps.navigation.getParam('key')
  const route: EventRouteStateType = state.cityContent.eventsRouteMapping[key]

  return {
    city: state.cityContent.city,
    languages: state.cityContent.languages.filter(language => route.allAvailableLanguages.has(language.code))
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>) => {
  return {
    changeLanguage: (city: string, newLanguage: string) => dispatch({
      type: 'SWITCH_CONTENT_LANGUAGE',
      params: {
        city,
        newLanguage
      }
    })
  }
}

// $FlowFixMe
export default withTheme(connect(mapStateToProps, mapDispatchToProps)(EventNotAvailable))
