import React, { useEffect, useState } from 'react';
import Header from '../components/UI/Header/Header';
import { useFetch } from '../hooks/useFetch';
import EventService from '../API/Service';
import EventsSection from '../components/EventsSection';

const Home = () => {
  const [events, setEvents] = useState([]);

  const [fetchEvents, eventsError, isEventsLoading] = useFetch(async () => {
    const response = await EventService.getAll(3);
    setEvents(response.data);
  });

  useEffect(()=>{
    fetchEvents()
  }, [])

  console.log(events);
  

  return (
    <div className='content'>
      <Header />
      <EventsSection events={events}/>
    </div>
  );
};

export default Home;
