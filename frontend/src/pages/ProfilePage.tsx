import Layout from './layout/Layout';
import { hostname } from '../config';
import image from '../assets/image.png';
import { useAppDispatch, useAppSelector } from '../store/store';
import { Link } from 'react-router';
import Ticket from '../components/UI/Ticket/Ticket';
import { TicketAPI } from '../store/TicketAPI';
import { getUser } from '../store/AuthSlice';
import { AsyncThunkAction, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import Button from '../components/UI/Button/Button';

const ProfilePage = () => {
  const user = useAppSelector((state) => state.auth.userProfile);
  const avatarUrl = user!.avatar ? hostname + user!.avatar : image;
  const [updatePaymentStatus] = TicketAPI.useUpdatePaymentStatusMutation();
  const dispatch = useAppDispatch();

  const onReturn = async (ticketId: number) => {
    if (!confirm('Вы уверены, что хотите вернуть билет?')) return;
    await updatePaymentStatus({
      ticketId,
      payment_status: 'on_canceled',
    }).unwrap();
    dispatch(getUser());
  };

  return (
    <Layout navIsVisible={false}>
      <div className="profile content">
        <div className="profile__left">
          <div className="profile__card">
            <img src={avatarUrl} className="profile__avatar" />
            <div className="profile__header"></div>
            <div>
              <div className="profile__name">
                <h2 className="profile__real-name">
                  {user!.first_name} {user!.last_name}
                </h2>
                <p className="profile__nickname">{user!.username}</p>
              </div>
              <div className="profile__about">
                {user!.vk_profile ? <p>vk: {user!.vk_profile}</p> : null}
                <p className="profile__info">{user!.description}</p>
              </div>
            </div>
          </div>

          <div className="profile__events">
            <Link to="" className="profile__tickets-title">
              Посещенные мероприятия {'>'}
            </Link>
            <div>
              {user && user.used_tickets ? (
                <div className="profile__events-list">
                  {user.used_tickets.map((ticket) => (
                    <Ticket ticket={ticket} type="event"></Ticket>
                  ))}
                </div>
              ) : (
                <p>Билетов нет</p>
              )}
            </div>
          </div>
        </div>

        <div className="profile__tickets">
          <Link to="" className="profile__tickets-title">
            Активные Билеты {'>'}
          </Link>
          <div>
            {user && user.active_tickets ? (
              <div className="profile__tickets-list">
                {user.active_tickets.map((ticket) => (
                  <Ticket ticket={ticket} type="ticket" onReturn={onReturn}>
                    {ticket.payment_status_display === 'На возврате' ? (
                      <Button isDisabled={true}>Заявка на возврат отправлена</Button>
                    ) : null}
                  </Ticket>
                ))}
              </div>
            ) : (
              <p>Билетов нет</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
function dispatch(
  arg0: AsyncThunkAction<
    any,
    void,
    {
      state?: unknown;
      dispatch?: ThunkDispatch<unknown, unknown, UnknownAction>;
      extra?: unknown;
      rejectValue?: unknown;
      serializedErrorType?: unknown;
      pendingMeta?: unknown;
      fulfilledMeta?: unknown;
      rejectedMeta?: unknown;
    }
  >,
) {
  throw new Error('Function not implemented.');
}
