import Button from './UI/Button/Button';
import EventCard from './EventCard';
import { IEvent } from '../API/types';
import { FC } from 'react';

interface EventSectionProps {
  events: IEvent[];
}

const EventsSection: FC<EventSectionProps> = ({ events }) => {
  return (
      <section className="events content">
        <h2>События в ближайшие дни</h2>
        <div className="events__wrap">
          {events.map((event) => (
            <EventCard event={event} key={event.id} />
          ))}
        </div>
        <Button styleType="sub" className="events__btn">
          Показать еще
        </Button>
      </section>
  );
};

export default EventsSection;
