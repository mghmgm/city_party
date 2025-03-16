import React from 'react';

const EventCard = ({ event }) => {
  return (
    <div className="events__event-card" key={event.id}>
      <img src="" alt="" />
      <h3>{event.title}</h3>
      <p></p>
    </div>
  );
};

export default EventCard;
