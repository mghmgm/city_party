import EventsSection from '../components/EventsSection';
import Layout from './layout/Layout';
import { EventAPI } from '../store/EventAPI';
import { IEvent } from '../types/types';

const Home = () => {
  const {
    data: events,
    isLoading: isEventsLoading,
    error: eventsError,
  } = EventAPI.useFetchEventsQuery(3);

  const defaultEvents: IEvent[] = [
    { id: 1, title: '', description: '', cover_image_url: '', reviews_count: 0 },
    { id: 2, title: '', description: '', cover_image_url: '', reviews_count: 0 },
    { id: 3, title: '', description: '', cover_image_url: '', reviews_count: 0 },
  ];
  const shownEvents = isEventsLoading ? defaultEvents : events || [];

  return (
    <Layout navIsVisible={true}>
      <EventsSection events={shownEvents} />
    </Layout>
  );
};

export default Home;
