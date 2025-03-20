import React, { FC } from 'react';
import { IPlace } from '../API/types';
import { hostname } from '../config';

interface PlaceCardProps {
  place: IPlace;
}

const PlaceCard: FC<PlaceCardProps> = ({ place }) => {
  const imgUrl = hostname + place.photo_url;
  return (
    <div className="places__card">
      <img src={imgUrl} alt="" className="places__img" />
      <p className='places__title'>{place.name}</p>
      <p>{place.address}</p>
    </div>
  );
};

export default PlaceCard;
