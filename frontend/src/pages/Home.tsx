import { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import EventService from '../API/EventService';
import EventsSection from '../components/EventsSection';
import Banner from '../components/Banner';
import { BannerService } from '../API/BannerService';
import TopSection from '../components/TopSection';
import PlacesSection from '../components/PlacesSection';
import PlaceService from '../API/PlaceService';
import Layout from './layout/Layout';
import { IBanner, IEvent, IPlace } from '../API/types';

const Home = () => {
  const [events, setEvents] = useState<IEvent[]>([
    { id: 1, title: '', description: '', cover_image_url: '' },
    { id: 2, title: '', description: '', cover_image_url: '' },
    { id: 3, title: '', description: '', cover_image_url: '' },
  ]);

  const [banners, setBanners] = useState<IBanner[]>([
    { id: 1, title: '', description: '', image_url: '' },
  ]);

  const [places, setPlaces] = useState<IPlace[]>([
    { id: 1, name: '', description: '', photo_url: '', address: '' },
    { id: 2, name: '', description: '', photo_url: '', address: '' },
    { id: 3, name: '', description: '', photo_url: '', address: '' },
  ]);

  const RandomBanner =
    banners.length > 0 ? banners[Math.floor(Math.random() * banners.length)] : null;

  const [fetchEvents] = useFetch(async () => {
    const response = await EventService.getAll(3);
    setEvents(response);
  });

  const [fetchPlaces] = useFetch(async () => {
    const response = await PlaceService.getAll(3);
    setPlaces(response);
  });

  const [fetchBanner] = useFetch(async () => {
    const response = await BannerService.getAll();
    if (response) {
      setBanners(response);
    }
  });

  useEffect(() => {
    fetchEvents();
    fetchBanner();
    fetchPlaces();
  }, []);

  return (
    <Layout navIsVisible={true}>
      <Banner banner={RandomBanner ? RandomBanner : banners[0]} />
      <EventsSection events={events} />
      <TopSection events={events} />
      {places && <PlacesSection places={places} />}
    </Layout>
  );
};

export default Home;
