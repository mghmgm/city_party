import { FC } from 'react';
import { IEvent } from '../API/types';
import { hostname } from '../config';

interface EventCardProps {
  event: IEvent,
}

const EventCard: FC<EventCardProps> = ({ event }) => {
  const imgUrl = hostname + event.cover_image_url

  return (
    <div className="events__event-card" key={event.id}>
      <img src={imgUrl} alt="" className='events__cover-image'/>
      <div className='events__titles'>
        <h3>{event.title}</h3>
        <p></p>
      </div>
    </div>
  );
};

export default EventCard;
