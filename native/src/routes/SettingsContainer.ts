import Settings, { PropsType as SettingsPropsType } from './Settings'
import withTheme from '../hocs/withTheme'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { StateType } from '../redux/StateType'

type StatePropsType = {
  languageCode: string
  cityCode: string | null | undefined
}

const mapStateToProps = (state: StateType): StatePropsType => {
  return {
    languageCode: state.contentLanguage,
    cityCode: state.cityContent?.city
  }
}

export default connect(mapStateToProps)(withTheme<Omit<SettingsPropsType, 't'>>(withTranslation('settings')(Settings)))
