import { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import EventService from '../API/EventService';
import EventsSection from '../components/EventsSection';
import Banner from '../components/Banner';
import { BannerService } from '../API/BannerService';
import TopSection from '../components/TopSection';
import PlacesSection from '../components/PlacesSection';
import PlaceService from '../API/PlaceService';
import Layout from './Layout';
import Navigation from '../components/Navigation';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [banners, setBanners] = useState([]);
  const [places, setPlaces] = useState([]);

  const RandomBanner =
    banners.length > 0 ? banners[Math.floor(Math.random() * banners.length)] : null;

  const [fetchEvents] = useFetch(async () => {
    const response = await EventService.getAll(3);
    setEvents(response.data);
  });

  const [fetchPlaces] = useFetch(async () => {
    const response = await PlaceService.getAll(3);
    setPlaces(response.data);
  });

  const [fetchBanner] = useFetch(async () => {
    const response = await BannerService.getAll();
    if (response) {
      setBanners(response.data);
    }
  });

  useEffect(() => {
    fetchEvents();
    fetchBanner();
    fetchPlaces();
  }, []);

  return (
    <Layout navIsVisible={true}>
      {RandomBanner && <Banner banner={RandomBanner} />}
      <EventsSection events={events} />
      <TopSection events={events} />
      <PlacesSection places={places} />
    </Layout>
  );
};

export default Home;