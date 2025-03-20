import { FC } from 'react';
import { IEvent } from '../API/types';
import { hostname } from '../config';

interface TopSectionProps {
  events: IEvent[];
}

const TopSection: FC<TopSectionProps> = ({ events }) => {
  return (
    <section className="top">
      <div className="top__wrap content">
        <h2>Топ-10 в вашем городе</h2>
        <div className="top__content">
          {events.map((event) => (
            <img
              src={hostname + event.cover_image_url}
              alt={event.title}
              key={event.id}
              className="top__cover-img"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export default TopSection;
