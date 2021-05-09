import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import type { TFunction } from "react-i18next";
import { withTranslation } from "react-i18next";
import Link from "redux-first-router-link";
import type { StyledComponent } from "styled-components";
import styled from "styled-components";
import { faFrown } from "../../../modules/app/constants/icons";
import I18nRedirectRouteConfig from "../../app/route-configs/I18nRedirectRouteConfig";
import type { ThemeType } from "build-configs/ThemeType";
const Centered: StyledComponent<{}, ThemeType, any> = styled.div`
  & > * {
    display: block;
    margin-top: 50px;
    text-align: center;
  }
`;
type PropsType = {
  errorMessage: string;
  goToPath?: string;
  goToMessage?: string;
  t: TFunction;
};

/**
 * Our error component, but since the name Error collides with the ES6 class, we've called it Failure
 */
export class Failure extends React.PureComponent<PropsType> {
  static defaultProps = {
    goToMessage: 'goTo.start',
    goToPath: new I18nRedirectRouteConfig().getRoutePath({})
  };

  render() {
    const {
      t,
      errorMessage,
      goToPath,
      goToMessage
    } = this.props;
    return <Centered>
        <div>{t(errorMessage)}</div>
        <div>
          <FontAwesomeIcon icon={faFrown} size='5x' />
        </div>
        {goToPath && <Link to={goToPath}>{goToMessage ? t(goToMessage) : goToPath}</Link>}
      </Centered>;
  }

}
export default withTranslation<PropsType>('error')(Failure);