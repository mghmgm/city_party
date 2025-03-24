import { FC } from 'react';
import { IEvent } from '../API/types';
import { hostname } from '../config';
import { Link } from 'react-router-dom';
import image from '../assets/image.png'

interface EventCardProps {
  event: IEvent;
}

const EventCard: FC<EventCardProps> = ({ event }) => {
  const imgUrl = event.cover_image_url? hostname + event.cover_image_url: image;
  const hrefId = `${event.id}`

  return (
    <Link className="events__event-card" key={event.id} to={`events/${hrefId}`}>
      <img src={imgUrl} alt={event.title} className="events__cover-image" />
      <div className="events__titles">
        <h3>{event.title}</h3>
        <p>{event.description}</p>
      </div>
    </Link>
  );
};

export default EventCard;
