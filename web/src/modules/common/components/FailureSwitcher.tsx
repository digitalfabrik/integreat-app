import * as React from "react";
import { NotFoundError } from "api-client";
import Failure from "./Failure";
import CategoriesRouteConfig from "../../app/route-configs/CategoriesRouteConfig";
import EventsRouteConfig from "../../app/route-configs/EventsRouteConfig";
import OffersRouteConfig from "../../app/route-configs/OffersRouteConfig";
import PoisRouteConfig from "../../app/route-configs/PoisRouteConfig";
import LocalNewsRouteConfig from "../../app/route-configs/LocalNewsRouteConfig";
import TunewsRouteConfig from "../../app/route-configs/TunewsRouteConfig";
import { LOCAL_NEWS_TYPE, TU_NEWS_TYPE } from "api-client/src/routes";
type PropsType = {
  error: Error;
};
export class FailureSwitcher extends React.Component<PropsType> {
  /**
   * Renders a Failure with a link to the "home" of the route and information about what was not found
   * @param error
   * @return {*}
   */
  static renderContentNotFoundComponent(error: NotFoundError): React.ReactNode {
    const {
      city,
      language
    } = error;

    switch (error.type) {
      case 'category':
        return <Failure goToPath={new CategoriesRouteConfig().getRoutePath({
          city,
          language
        })} goToMessage='goTo.categories' errorMessage='notFound.category' />;

      case 'event':
        return <Failure goToPath={new EventsRouteConfig().getRoutePath({
          city,
          language
        })} goToMessage='goTo.events' errorMessage='notFound.event' />;

      case LOCAL_NEWS_TYPE:
        return <Failure goToPath={new LocalNewsRouteConfig().getRoutePath({
          city,
          language
        })} goToMessage='goTo.localNews' errorMessage='notFound.localNews' />;

      case TU_NEWS_TYPE:
        return <Failure goToPath={new TunewsRouteConfig().getRoutePath({
          city,
          language
        })} goToMessage='goTo.tunews' errorMessage='notFound.tunews' />;

      case 'offer':
        return <Failure goToPath={new OffersRouteConfig().getRoutePath({
          city,
          language
        })} goToMessage='goTo.offers' errorMessage='notFound.offer' />;

      case 'poi':
        return <Failure goToPath={new PoisRouteConfig().getRoutePath({
          city,
          language
        })} goToMessage='goTo.pois' errorMessage='notFound.poi' />;
    }

    throw new Error('Failed to find component to render a content error');
  }

  render() {
    const error = this.props.error;

    if (error instanceof NotFoundError) {
      return FailureSwitcher.renderContentNotFoundComponent(error);
    } else {
      return <Failure errorMessage={error.message} />;
    }
  }

}
export default FailureSwitcher;