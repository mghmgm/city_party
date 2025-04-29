import { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import AuthService from '../API/AuthService';
import Layout from './layout/Layout';
import { hostname } from '../config';
import { IUserProfile } from '../types/types';
import image from '../assets/image.png';

const ProfilePage = () => {
  const [user, setUser] = useState<IUserProfile>({
    username: '',
    last_name: '',
    first_name: '',
    description: '',
    avatar: '',
    vk_profile: '',
  });

  const avatarUrl = user.avatar ? hostname + user.avatar : image;

  const [fetchUser] = useFetch(async () => {
    const response = await AuthService.getCurrentUser();
    setUser(response);
  });

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Layout navIsVisible={false}>
      <div className="profile content">
        <div className="profile__card">
          <img src={avatarUrl} className="profile__avatar" />
          <div className="profile__header"></div>
          <div>
            <div className="profile__name">
              <h2 className="profile__real-name">
                {user.first_name} {user.last_name}
              </h2>
              <p className="profile__nickname">{user.username}</p>
            </div>
            <div className="profile__about">
              {user.vk_profile ? <p>vk: {user.vk_profile}</p> : null}
              <p className="profile__info">{user.description}</p>
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
