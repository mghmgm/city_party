import { FC } from 'react';
import Button from './UI/Button/Button';
import { IPlace } from '../types/types';
import PlaceCard from './PlaceCard';

interface PlacesSectionProps {
  places: IPlace[];
}

const PlacesSection: FC<PlacesSectionProps> = ({ places }) => {
  return (
    <section className="places content">
      <h2>Какие места посетить?</h2>
      <div className="places__container">
        {places.map((place, index) => (
          <PlaceCard place={place} key={index} />
        ))}
      </div>
      <Button styleType="sub" className="places__btn">
        Показать еще
      </Button>
    </section>
  );
};

export default PlacesSection;
