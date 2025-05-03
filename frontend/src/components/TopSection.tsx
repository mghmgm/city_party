import { FC } from 'react';
import { IEvent } from '../types/types';
import { hostname } from '../config';

interface TopSectionProps {
  events: IEvent[];
}

const TopSection: FC<TopSectionProps> = ({ events }) => {
  return (
    <section className="tops">
      <div className="tops__wrap content">
        <h2>Топ-10 в вашем городе</h2>
        <div className="tops__content">
          {events.map((event) => (
            <img
              src={hostname + event.cover_image_url}
              alt={event.title}
              key={event.id}
              className="tops__cover-img"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export default TopSection;
