import Button from './UI/Button/Button';
import EventCard from './EventCard';
import { IEvent } from '../types/types';
import { FC } from 'react';
import { Link } from 'react-router';

interface EventSectionProps {
  events: IEvent[];
}

const EventsSection: FC<EventSectionProps> = ({ events }) => {
  return (
    <section className="events content">
      <Link to="#" className='events__title'>Рекомендованные события {'>'}</Link>
      <div className="events__wrap">
        {events.map((event) => (
          <EventCard event={event} key={event.id} />
        ))}
      </div>
    </section>
  );
};

export default EventsSection;
