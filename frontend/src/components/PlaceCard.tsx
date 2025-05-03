import { FC } from 'react';
import { IPlace } from '../types/types';
import { hostname } from '../config';
import image from '../assets/image.png';

interface PlaceCardProps {
  place: IPlace;
}

const PlaceCard: FC<PlaceCardProps> = ({ place }) => {
  const imgUrl = place.photo_url ? hostname + place.photo_url : image;

  return (
    <div className="places__card">
      <img src={imgUrl} alt="" className="places__img" />
      <p className="places__title">{place.name}</p>
      <p>{place.address}</p>
    </div>
  );
};

export default PlaceCard;
