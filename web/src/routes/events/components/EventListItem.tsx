import * as React from "react";
import { EventModel } from "api-client";
import ListItem from "../../../modules/common/components/ListItem";
import EventPlaceholder1 from "../assets/EventPlaceholder1.jpg";
import EventPlaceholder2 from "../assets/EventPlaceholder2.jpg";
import EventPlaceholder3 from "../assets/EventPlaceholder3.jpg";
import DateFormatter from "api-client/src/i18n/DateFormatter";
import textTruncator from "../../../modules/common/utils/textTruncator";
export const NUM_OF_WORDS_ALLOWED = 15;
type PropsType = {
  event: EventModel;
  formatter: DateFormatter;
};

/**
 * We have three placeholder thumbnails to display when cities don't provide a thumbnail
 * @returns {*} The Placeholder Thumbnail
 */
const getEventPlaceholder = (path: string): string => {
  const pseudoId = path.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const placeholders = [EventPlaceholder1, EventPlaceholder2, EventPlaceholder3];
  return placeholders[pseudoId % placeholders.length];
};

const EventListItem = ({
  event,
  formatter
}: PropsType) => {
  return <ListItem thumbnail={event.thumbnail || getEventPlaceholder(event.path)} title={event.title} path={event.path}>
      <div>
        <div>{event.date.toFormattedString(formatter)}</div>
        {event.location.location && <div>{event.location.location}</div>}
      </div>
      <div>{textTruncator(event.excerpt, NUM_OF_WORDS_ALLOWED)}</div>
    </ListItem>;
};

export default EventListItem;