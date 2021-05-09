import { $Diff } from "utility-types";
import * as React from "react";
import { useEffect, useState } from "react";
import { LanguageModel } from "api-client";
import { RefreshControl } from "react-native";
import LanguageNotAvailableContainer from "../../common/containers/LanguageNotAvailableContainer";
import type { StoreActionType } from "../../app/StoreActionType";
import type { Dispatch } from "redux";
import "redux";
import FailureContainer from "../../error/containers/FailureContainer";
import { LOADING_TIMEOUT } from "../../common/constants";
import type { ErrorCode } from "../../error/ErrorCodes";
import wrapDisplayName from "../../common/hocs/wrapDisplayName";
import type { NavigationPropType, RoutePropType, RoutesType } from "../../app/constants/NavigationTypes";
import type { TFunction } from "react-i18next";
import "react-i18next";
import LayoutContainer from "../../layout/containers/LayoutContainer";
import LayoutedScrollView from "../../common/containers/LayoutedScrollView";
import ProgressContainer from "../../common/containers/ProgressContainer";
export type RouteNotInitializedType = {
  status: "routeNotInitialized";
};
export type LoadingType<S extends {}, R extends {}> = {
  status: "loading";
  progress: number;
  innerProps?: S;
  refreshProps?: R;
};
export type ErrorType<R extends {}> = {
  status: "error";
  message: string | null | undefined;
  code: ErrorCode;
  refreshProps: R | null;
};
export type LanguageNotAvailableType = {
  status: "languageNotAvailable";
  availableLanguages: Array<LanguageModel>;
  cityCode: string;
  changeUnavailableLanguage: (dispatch: Dispatch<StoreActionType>, newLanguage: string) => void;
};
export type SuccessType<S extends {}, R extends {}> = {
  status: "success";
  innerProps: S;
  refreshProps: R;
};
export type StatusPropsType<S extends {
  dispatch: Dispatch<StoreActionType>;
}, R extends {}> = RouteNotInitializedType | LoadingType<$Diff<S, {
  dispatch: Dispatch<StoreActionType>;
}>, R> | ErrorType<R> | LanguageNotAvailableType | SuccessType<$Diff<S, {
  dispatch: Dispatch<StoreActionType>;
}>, R>;
export type PropsType<S extends {
  dispatch: Dispatch<StoreActionType>;
}, R extends {}, T extends RoutesType> = (StatusPropsType<S, R> & {
  dispatch: Dispatch<StoreActionType>;
  navigation: NavigationPropType<T>;
  route: RoutePropType<T>;
  t: TFunction;
}) | (StatusPropsType<S, R> & {
  dispatch: Dispatch<StoreActionType>;
  navigation: NavigationPropType<T>;
  route: RoutePropType<T>;
});

const withPayloadProvider = <S extends {
  dispatch: Dispatch<StoreActionType>;
}, R extends {}, T extends RoutesType>(refresh: (refreshProps: R, dispatch: Dispatch<StoreActionType>) => void, onRouteClose?: (routeKey: string, dispatch: Dispatch<StoreActionType>) => void, noScrollView?: boolean): (Component: React.ComponentType<S>) => React.ComponentType<PropsType<S, R, T>> => {
  return (Component: React.ComponentType<S>): React.ComponentType<PropsType<S, R, T>> => {
    const Wrapper = (props: PropsType<S, R, T>) => {
      const [timeoutExpired, setTimeoutExpired] = useState(false);
      useEffect(() => {
        const timer = setTimeout(() => {
          setTimeoutExpired(true);
        }, LOADING_TIMEOUT);
        return () => clearTimeout(timer);
      }, []);
      useEffect(() => {
        if (onRouteClose) {
          return () => onRouteClose(props.route.key, props.dispatch);
        }
      }, [props.route.key, props.dispatch]);

      function refreshIfPossible() {
        if (props.status === 'routeNotInitialized' || props.status === 'loading' || props.status === 'languageNotAvailable') {
          throw Error('Refreshing is not possible because the route is not yet initialized or already loading.');
        }

        if (props.refreshProps) {
          refresh(props.refreshProps, props.dispatch);
        }
      }

      function changeUnavailableLanguage(newLanguage: string) {
        if (props.status !== 'languageNotAvailable') {
          throw Error('Call of changeUnavailableLanguage is only possible when language is not available.');
        }

        props.changeUnavailableLanguage(props.dispatch, newLanguage);
      }

      if (props.status === 'routeNotInitialized') {
        return <LayoutContainer />;
      } else if (props.status === 'error') {
        return <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refreshIfPossible} refreshing={false} />}>
            <FailureContainer tryAgain={refreshIfPossible} code={props.code} />
          </LayoutedScrollView>;
      } else if (props.status === 'languageNotAvailable') {
        return <LanguageNotAvailableContainer languages={props.availableLanguages} changeLanguage={changeUnavailableLanguage} />;
      } else if (props.status === 'loading') {
        const {
          innerProps,
          dispatch
        } = props;

        if (!timeoutExpired) {
          // Prevent jumpy behaviour by showing nothing until the timeout finishes
          return <LayoutContainer />;
        } else if (!!innerProps && !!dispatch) {
          // Display previous content if available
          return <LayoutedScrollView refreshControl={<RefreshControl refreshing />}>
              <Component {...innerProps} dispatch={dispatch} />
            </LayoutedScrollView>;
        } else {
          // Full screen loading spinner
          return <LayoutedScrollView refreshControl={<RefreshControl refreshing={false} />}>
              <ProgressContainer progress={props.progress} />
            </LayoutedScrollView>;
        }
      } else {
        // props.status === 'success'
        if (noScrollView) {
          return <LayoutContainer>
              <Component {...props.innerProps} dispatch={props.dispatch} />
            </LayoutContainer>;
        }

        return <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refreshIfPossible} refreshing={false} />}>
            <Component {...props.innerProps} dispatch={props.dispatch} />
          </LayoutedScrollView>;
      }
    };

    Wrapper.displayName = wrapDisplayName(Component, 'withPayloadProvider');
    return Wrapper;
  };
};

export default withPayloadProvider;