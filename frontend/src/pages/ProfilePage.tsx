import Layout from './layout/Layout';
import { hostname } from '../config';
import image from '../assets/image.png';
import { useAppSelector } from '../store/store';
import Button from '../components/UI/Button/Button';
import { Link } from 'react-router';

const ProfilePage = () => {
  const user = useAppSelector((state) => state.auth.userProfile);
  const avatarUrl = user!.avatar ? hostname + user!.avatar : image;

  return (
    <Layout navIsVisible={false}>
      <div className="profile content">
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
        <div className="profile__tickets">
          <h2>Билеты {'>'}</h2>
          <div>
            {user && user.tickets ? (
              <div className="profile__tickets-list">
                {user.tickets.map((ticket) => (
                  <div className="profile__ticket">
                    <img
                      src={hostname + `${ticket.cover_img_url}`}
                      alt={ticket.event_title}
                      className="profile__ticket-image"
                    />
                    <Link to="" className="profile__ticket-title">
                      {ticket.event_title}
                    </Link>
                    <p>{ticket.description}</p>
                    <p>{ticket.payment_status}</p>
                    {ticket.payment_status === 'Не оплачен' ? (
                      <Button className="profile__ticket-btn">Оплатить</Button>
                    ) : (
                      <Button className="profile__ticket-btn">Вернуть</Button>
                    )}
                  </div>
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
