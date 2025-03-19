import { useEffect, useState } from 'react';
import Header from '../components/UI/Header/Header';
import { useFetch } from '../hooks/useFetch';
import EventService from '../API/EventService';
import EventsSection from '../components/EventsSection';
import Banner from '../components/Banner';
import { BannerService } from '../API/BannerService';
import { IBanner } from '../API/types';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [isBannerLoading, setIsBannerLoading] = useState<boolean>(true);

  const RandomBanner = banners.length > 0 ? banners[Math.floor(Math.random() * banners.length)] : null;

  const [fetchEvents, eventsError, isEventsLoading] = useFetch(async () => {
    const response = await EventService.getAll(3);
    setEvents(response.data);
  });

  const [fetchBanner, bannerError, isBannerLoadingFetch] = useFetch(async () => {
    const response = await BannerService.getAll();
    if (response) {
      setBanners(response.data);
      setIsBannerLoading(false);
    }
  });

  useEffect(() => {
    fetchEvents();
    fetchBanner();
  }, []);

  return (
    <div className='content'>
      <Header />
      {isBannerLoading ? (
        <div>Loading Banner...</div>
      ) : (
        RandomBanner && <Banner banner={RandomBanner} />
      )}
      <EventsSection events={events} />
    </div>
  );
};

export default Home;