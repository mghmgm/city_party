import { FC } from 'react';
import { hostname } from '../config';
import { IBanner } from '../types/types';
import image from '../assets/image.png';

interface BannerProps {
  banner: IBanner;
}

const Banner: FC<BannerProps> = ({ banner }) => {
  const imgUrl = banner.image_url ? hostname + banner.image_url : image;

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
