import React, { useEffect, useState } from 'react';
import Header from '../components/UI/Header/Header';
import { useFetch } from '../hooks/useFetch';
import EventService from '../API/Service';

const Home = () => {
  const [events, setEvents] = useState([]);

  const [fetchEvents, eventsError, isEventsLoading] = useFetch(async () => {
    const response = await EventService.getAll();
    setEvents(response.data);
  });

  useEffect(()=>{
    fetchEvents()
  }, [])

  console.log(events);

  return (
    <div>
      <Header />
    </div>
  );
};

export default Home;
