import { FC } from 'react';
import { IEvent } from '../types/types';
import { hostname } from '../config';
import star from '../assets/star.svg'

interface TopSectionProps {
  events: IEvent[];
}

const TopSection: FC<TopSectionProps> = ({ events }) => {
  return (
    <section className="tops">
      <div className="tops__wrap content">
        <h2>Топ-3 в вашем городе</h2>
        <div className="tops__content">
          {events.map((event, index) => (
            <div key={index}>
              <div className='tops__event-info'>
                <p className='tops__event-place'>{index+1}</p>
                <div className='tops__event-titles'>
                  <p className='tops__event-title'>{event.title}</p>
                  <div className='tops__rating'>
                    <img src={star} alt="" />
                    <p>{event.rating_avg.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <img
                src={hostname + event.cover_image_url}
                alt={event.title}
                key={event.id}
                className="tops__cover-img"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default TopSection;
