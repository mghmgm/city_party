import { hostname } from '../../../config';
import { Link } from 'react-router';
import { ru } from 'date-fns/locale';
import Button from '../Button/Button';
import { FC, ReactNode } from 'react';
import { ITicket } from '../../../types/types';
import { format } from 'date-fns';
import classes from './Ticket.module.scss';
import { useGetTicketTypeByIdQuery } from '../../../store/TicketTypeApi';

interface TicketProps {
  ticket: ITicket;
  type: 'ticket' | 'event';
  onReturn?: (ticketId: number) => void;
  children?: ReactNode;
}

const Ticket: FC<TicketProps> = ({ ticket, type, onReturn, children }) => {
  const { data: ticketType } = useGetTicketTypeByIdQuery(ticket.ticket_type_id);
  let btnText;
  let link;
  let onClickHandler;

  if (type === 'ticket') {
    if (ticket.payment_status_display === 'Оплачен') {
      btnText = 'Вернуть';
      onClickHandler = () => {
        if (onReturn) {
          onReturn(ticket.id);
        }
      };
    } else if (ticket.payment_status_display === 'Не оплачен') {
      btnText = 'Оплатить';
    }
  } else {
    btnText = 'Написать отзыв';
    link = `/events/${ticket.event.id}`;
  }

  return (
    <div
      Link
      to={`/events/${ticket.event.id}`}
      className={type === 'ticket' ? classes.ticket : classes.event}
    >
      <Link to={`/events/${ticket.event.id}`}>
        <img
          src={hostname + `${ticket.event.cover_image_url}`}
          alt={ticket.event.title}
          className={type === 'ticket' ? classes.ticketImg : classes.eventImg}
        />
      </Link>

      <div className={type === 'ticket' ? classes.ticketInfo : classes.eventInfo}>
        <Link
          to={`/events/${ticket.event.id}`}
          className={type === 'ticket' ? classes.ticketContainer : classes.eventContainer}
        >
          <p className={classes.title}>
            {ticket.event.title} {'>'}
          </p>
          {ticketType ? (
            <>
              <p>
                {format(new Date(ticketType.start_date), 'd MMMM', { locale: ru })}{' '}
                {format(new Date(ticketType.start_date), 'HH:mm', { locale: ru })} -{' '}
                {format(new Date(ticketType.end_date), 'HH:mm', { locale: ru })}
              </p>
            </>
          ) : (
            <p>Загрузка данных...</p>
          )}
          {children}
        </Link>
        {ticket.payment_status_display !== 'На возврате' ? (
          <Button
            href={link}
            className={type === 'ticket' ? classes.ticketButton : classes.eventButton}
            onClick={onClickHandler}
          >
            {btnText}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default Ticket;
