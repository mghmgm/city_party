import Button from './UI/Button/Button';
import EventCard from './EventCard';

const EventsSection = ({ events }) => {
  return (
    <section className="events">
      <h2>События в ближайшие дни</h2>
      <div className="events__wrap">
        {events.map((event) => (
          <EventCard event={event} key={event.id}/>
        ))}
      </div>
      <Button type="sub" className="events__btn">
        Показать еще
      </Button>
    </section>
  );
};

export default EventsSection;
