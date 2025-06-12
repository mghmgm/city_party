import { FC } from 'react';
import { IEvent, IGallery, ITicketType } from '../types/types';
import { hostname } from '../config';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface EventInfoProps {
  event: IEvent;
  gallery: IGallery;
  ticketTypes: ITicketType[];
  onClick: (e: React.MouseEvent, ticket: ITicketType) => void;
}

const EventInfo: FC<EventInfoProps> = ({ event, gallery, ticketTypes, onClick }) => {
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
          {ticketTypes.map((ticket) =>
            ticket.available_quantity > 0 ? (
              <button
                className="event__ticket-card"
                key={ticket.id}
                onClick={(e) => onClick(e, ticket)}
                aria-label={`Билет на ${format(new Date(ticket.start_date), 'd MMMM', { locale: ru })}`}
              >
                <p>{format(new Date(ticket.start_date), 'd MMMM', { locale: ru })}</p>
                <p>
                  {format(new Date(ticket.start_date), 'HH:mm', { locale: ru })} -{' '}
                  {format(new Date(ticket.end_date), 'HH:mm', { locale: ru })}
                </p>
                <p className="event__price">{ticket.price} руб.</p>
              </button>
            ) : (
              <div className="event__ticket-card event__ticket-card--sold-out" key={ticket.id}>
                <p>{format(new Date(ticket.start_date), 'd MMMM', { locale: ru })}</p>
                <p>
                  {format(new Date(ticket.start_date), 'HH:mm', { locale: ru })} -{' '}
                  {format(new Date(ticket.end_date), 'HH:mm', { locale: ru })}
                </p>
                <p>Билеты закончились</p>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default EventInfo;
