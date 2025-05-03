import EventsSection from '../components/EventsSection';
import Layout from './layout/Layout';
import { EventAPI } from '../store/EventAPI';
import { IEvent } from '../types/types';
import TopSection from '../components/TopSection';

const Home = () => {
  const {
    data: events,
    isLoading: isEventsLoading,
  } = EventAPI.useFetchEventsQuery(3);

  const { data: topEvents, isLoading: isTopLoading } = EventAPI.useFetchEventsQuery({limit: 3, ordering: "rating"})

  const defaultEvents: IEvent[] = [
    { id: 1, title: '', description: '', cover_image_url: '', reviews_count: 0 },
    { id: 2, title: '', description: '', cover_image_url: '', reviews_count: 0 },
    { id: 3, title: '', description: '', cover_image_url: '', reviews_count: 0 },
  ];
  
  const shownEvents = isEventsLoading ? defaultEvents : events || [];
  const shownTop = isTopLoading ? defaultEvents : topEvents || [];

  return (
    <Layout navIsVisible={true}>
      <EventsSection events={shownEvents} />
      <TopSection events={shownTop} />
    </Layout>
  );
};

export default Home;
