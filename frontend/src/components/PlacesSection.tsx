import { FC } from 'react';
import Button from './UI/Button/Button';
import { IPlace } from '../types/types';
import PlaceCard from './PlaceCard';
import { Link } from 'react-router';

interface PlacesSectionProps {
  places: IPlace[];
}

const PlacesSection: FC<PlacesSectionProps> = ({ places }) => {
  return (
    <section className="places content">
      <Link to="#" className='places__title'>Какие места посетить? {'>'}</Link>
      <div className="places__container">
        {places.map((place, index) => (
          <PlaceCard place={place} key={index} />
        ))}
      </div>
    </section>
  );
};

export default PlacesSection;
