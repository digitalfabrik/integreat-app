import * as React from "react";
import type { ThemeType } from "../../theme/constants";
import { StatusBar as ReactNativeStatusBar } from "react-native";
type PropsType = {
  theme: ThemeType;
};

class StatusBar extends React.PureComponent<PropsType> {
  render() {
    return <ReactNativeStatusBar backgroundColor={this.props.theme.colors.backgroundAccentColor} barStyle='dark-content' />;
  }

}

export default StatusBar;