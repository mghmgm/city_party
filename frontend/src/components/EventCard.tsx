import { FC } from 'react';
import { IEvent } from '../types/types';
import { hostname } from '../config';
import { Link } from 'react-router-dom';
import image from '../assets/image.png';

interface EventCardProps {
  event: IEvent;
}

const EventCard: FC<EventCardProps> = ({ event }) => {
  const imgUrl = event.cover_image_url ? hostname + event.cover_image_url : image;

  return (
    <Link className="events__event-card" key={event.id} to={`/events/${event.id}`}>
      <img src={imgUrl} alt={event.title} className="events__cover-image" />
      <div className="events__titles">
        <h3>{event.title}</h3>
        <p>{event.description}</p>
      </div>
    </Link>
  );
};

export default EventCard;
