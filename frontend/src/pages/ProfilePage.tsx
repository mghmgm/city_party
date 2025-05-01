import { useEffect } from 'react';
import Layout from './layout/Layout';
import { hostname } from '../config';
import image from '../assets/image.png';
import { useAppDispatch, useAppSelector } from '../store/store';
import { getUser } from '../store/AuthSlice';

const ProfilePage = () => {
  const user = useAppSelector(state=>state.auth.userProfile)
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
          <h2>Купленные билеты</h2>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
