import EventsSection from '../components/EventsSection';
import Layout from './layout/Layout';
import { EventAPI } from '../store/EventAPI';
import { IBanner, IEvent, IPlace } from '../types/types';
import TopSection from '../components/TopSection';
import { BannerAPI } from '../store/BannerAPI';
import Banner from '../components/Banner';
import PlacesSection from '../components/PlacesSection';
import { PlaceAPI } from '../store/PlaceAPI';

const Home = () => {
  const { data: events, isLoading: isEventsLoading } = EventAPI.useFetchEventsQuery({limit: 3});
  const { data: topEvents, isLoading: isTopLoading } = EventAPI.useFetchEventsQuery({
    limit: 3,
    ordering: 'rating',
  });
  const {data: banner, isLoading: isBannerLoading } = BannerAPI.useFetchRandomBannerQuery()
  const {data: places, isLoading: isPlacesLoading } = PlaceAPI.useFetchPlacesQuery(3)

  const defaultEvents: IEvent[] = [
    { id: 1, title: '', description: '', cover_image_url: '', reviews_count: 0, rating_avg: 0 },
    { id: 2, title: '', description: '', cover_image_url: '', reviews_count: 0, rating_avg: 0 },
    { id: 3, title: '', description: '', cover_image_url: '', reviews_count: 0, rating_avg: 0 },
  ];
  const defaultBanner: IBanner[] = [
    { id: 1, title: "", description: "", image_url: "", event_id: 0 },
  ];
  const defaultPlace: IPlace[] = [
    { id: 1, name: "", description: "", photo_url: "", address: ""},
  ];

  const shownEvents = isEventsLoading ? defaultEvents : events || [];
  const shownTop = isTopLoading ? defaultEvents : topEvents || [];
  const shownBanner = isBannerLoading ? defaultBanner : banner || [];
  const shownPlaces = isPlacesLoading ? defaultPlace : places || [];

  return (
    <Layout navIsVisible={true}>
      <Banner banner={shownBanner}/>
      <EventsSection events={shownEvents} />
      <TopSection events={shownTop} />
      <PlacesSection places={shownPlaces}/>
    </Layout>
  );
};

export default Home;
