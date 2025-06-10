import { FC } from 'react';
import { hostname } from '../config';
import { IBanner } from '../types/types';
import image from '../assets/image.png';
import { Link } from 'react-router-dom';

interface BannerProps {
  banner: IBanner;
}

const Banner: FC<BannerProps> = ({ banner }) => {
  const imgUrl = banner.image_url ? hostname + banner.image_url : image;

  return (
    <section className="banner content">
      {banner.event_id ? (
        <Link to={`/events/${banner.event_id}`} style={{ width: '100%', display: 'block' }}>
          <img src={imgUrl} alt="" className="banner__img" />
        </Link>
      ) : (
        <img src={imgUrl} alt="" className="banner__img" />
      )}
    </section>
  );
};

export default Banner;
