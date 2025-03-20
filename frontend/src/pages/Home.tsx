import { useEffect, useState } from 'react';
import Header from '../components/UI/Header/Header';
import { useFetch } from '../hooks/useFetch';
import EventService from '../API/EventService';
import EventsSection from '../components/EventsSection';
import Banner from '../components/Banner';
import { BannerService } from '../API/BannerService';
import TopSection from '../components/TopSection';
import PlacesSection from '../components/PlacesSection';
import Footer from '../components/UI/Footer/Footer';
import PlaceService from '../API/PlaceService';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [banners, setBanners] = useState([]);
  const [topEvents, setTopEvents] = useState();
  const [places, setPlaces] = useState([]);

  const RandomBanner =
    banners.length > 0 ? banners[Math.floor(Math.random() * banners.length)] : null;

  const [fetchEvents, eventsError, isEventsLoading] = useFetch(async () => {
    const response = await EventService.getAll(3);
    setEvents(response.data);
  });

  const [fetchPlaces, placesError, isPlacesLoading] = useFetch(async () => {
    const response = await PlaceService.getAll(3);
    setPlaces(response.data);
  });

  const [fetchBanner, bannerError, isBannerLoadingFetch] = useFetch(async () => {
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
    <div className="home__content">
      <Header />
      {RandomBanner && <Banner banner={RandomBanner} />}
      <EventsSection events={events} />
      <TopSection events={events} />
      <PlacesSection places={places} />
      <Footer />
    </div>
  );
};

export default Home;
