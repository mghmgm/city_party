import { FC } from 'react';
import { hostname } from '../config';
import { IBanner } from '../API/types';

interface BannerProps {
  banner: IBanner;
}

const Banner: FC<BannerProps> = ({ banner }) => {
  const imgUrl = hostname + banner.image_url;

  return (
      <section className="banner content">
        <img src={imgUrl} alt="" className="banner__img" />
        <div className="banner__info">
          <h2 className="banner__title">{banner.title}</h2>
          <p>{banner.description}</p>
        </div>
      </section>
  );
};

export default Banner;
