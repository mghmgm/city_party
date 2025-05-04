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

  const content = (
    <>
      <img src={imgUrl} alt="" className="banner__img" />
      <div className="banner__info">
        <h2 className="banner__title">{banner.title}</h2>
        <p>{banner.description}</p>
      </div>
    </>
  );

  return (
    <section className="banner content">
      {banner.event_id ? (
        <Link to={`/events/${banner.event_id}`} style={{ width: '100%', display: 'block' }}>
          {content}
        </Link>
      ) : (
        content
      )}
    </section>
  );
};

export default Banner;
