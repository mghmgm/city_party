import { FC } from 'react';
import { IEvent } from '../API/types';

interface EventCardProps {
  event: IEvent,
}

const EventCard: FC<EventCardProps> = ({ event }) => {
  return (
    <div className="events__event-card" key={event.id}>
      <img src="" alt="" />
      <h3>{event.title}</h3>
      <p></p>
    </div>
  );
};

export default EventCard;
