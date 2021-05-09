import * as React from "react";
type I18nType = typeof import("i18next").default;
const realModule = jest.requireActual('react-i18next');

const withTranslation = <S extends {}>(namespace: string) => (Component: React.AbstractComponent<S & {
  t: (arg0: string) => string;
}>): React.AbstractComponent<S> => {
  return class extends React.Component<S> {
    render() {
      return <Component {...this.props} t={key => key} />;
    }

  };
};

module.exports = {
  withTranslation,
  I18nextProvider: (props: {
    i18n: I18nType;
    children: React.ReactNode;
  }) => <>{props.children}</>,
  reactI18nextModule: realModule.reactI18nextModule
};