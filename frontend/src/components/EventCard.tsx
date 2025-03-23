import { FC } from 'react';
import { IEvent } from '../API/types';
import { hostname } from '../config';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: IEvent;
}

const EventCard: FC<EventCardProps> = ({ event }) => {
  const imgUrl = hostname + event.cover_image_url;
  const hrefId = `${event.id}`

  return (
    <Link className="events__event-card" key={event.id} to={hrefId}>
      <img src={imgUrl} alt="" className="events__cover-image" />
      <div className="events__titles">
        <h3>{event.title}</h3>
        <p>{event.description}</p>
      </div>
    </Link>
  );
};

export default EventCard;
