import { FC } from 'react';
import { IEvent, IGallery, ITicketType } from '../types/types';
import { hostname } from '../config';

interface EventInfoProps {
  event: IEvent;
  gallery: IGallery;
  ticketTypes: ITicketType[];
}

const EventInfo: FC<EventInfoProps> = ({ event, gallery, ticketTypes }) => {
  const getImgUrl = (href: string) => hostname + href;
  const imgUrls = gallery.photos.map((image) => getImgUrl(image.image));

  return (
    <section className="event content">
      <h1 className="event__title">{event.title}</h1>
      <div className="event__gallery">
        {imgUrls.length > 0
          ? imgUrls.map((url, index) => (
              <div className="event__img-container" key={index}>
                <img src={url} className="event__img" />
              </div>
            ))
          : null}
      </div>

      <div className="event__about">
        <h2>О событии</h2>
        <p>{event.description}</p>
      </div>

      <div className="event__schedule">
        <h2>Расписание</h2>
        <div className="event__tickets">
          {ticketTypes.map((ticket) => (
            <div className="event__ticket-card">
              <p>{ticket.description}</p>
              <p className="event__price">{ticket.price} руб.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventInfo;
