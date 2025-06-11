import { hostname } from '../../../config';
import { Link } from 'react-router';
import { ru } from 'date-fns/locale';
import Button from '../Button/Button';
import { FC } from 'react';
import { ITicket } from '../../../types/types';
import { format } from 'date-fns';
import classes from './Ticket.module.scss';

interface TicketProps {
  ticket: ITicket;
  type: 'ticket' | 'event';
}

const Ticket: FC<TicketProps> = ({ ticket, type }) => {
  let btnText;
  let link;

  if (type === 'ticket') {
    if (ticket.payment_status === 'Оплачен') {
      btnText = 'Вернуть'
    } else {
      btnText =  'Оплатить'
    }
  } else {
    btnText =  'Написать отзыв'
    link = `/events/${ticket.event_id}`
  }

  return (
    <div className={type === 'ticket' ? classes.ticket : classes.event}>
      <img
        src={hostname + `${ticket.cover_img_url}`}
        alt={ticket.event_title}
        className={type === 'ticket' ? classes.ticketImg : classes.eventImg}
      />

      <div className={type === 'ticket' ? classes.ticketInfo : classes.eventInfo}>
        <div className={type === 'ticket' ? classes.ticketContainer : classes.eventContainer}>
          <Link to={`/events/${ticket.event_id}`} className={classes.title}>
            {ticket.event_title} {'>'}
          </Link>
          <p>
            {format(new Date(ticket.ticket_type.start_date), 'd MMMM', { locale: ru })}{' '}
            {format(new Date(ticket.ticket_type.start_date), 'HH:mm', { locale: ru })} -{' '}
            {format(new Date(ticket.ticket_type.end_date), 'HH:mm', { locale: ru })}
          </p>
        </div>
        <Button href={link} className={type === 'ticket' ? classes.ticketButton : classes.eventButton}>{btnText}</Button>
      </div>
    </div>
  );
};

export default Ticket;
