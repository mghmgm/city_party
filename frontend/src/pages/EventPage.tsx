import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from './Layout';
import { useFetch } from '../hooks/useFetch';
import EventService from '../API/EventService';
import { IEvent, IGallery, ITicketType } from '../API/types';
import EventInfo from '../components/EventInfo';

const EventPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [gallery, setGallery] = useState<IGallery | null>(null);
  const [ticketTypes, setTicketTypes] = useState<ITicketType[] | null>(null);

  const [eventFetch] = useFetch(async () => {
    if (!id) return;
    const response = await EventService.getById(id);
    setEvent(response.data);
  });

  const [galleryFetch] = useFetch(async () => {
    const response = await EventService.getGallery(id, 3);
    setGallery(response.data);
  });

  const [ticketTypesFetch] = useFetch(async () => {
    const response = await EventService.getTicketTypes(id);
    setTicketTypes(response.data);
  });

  useEffect(() => {
    eventFetch();
    galleryFetch();
    ticketTypesFetch();
  }, [id]);

  return (
    <Layout>
      {event && gallery && ticketTypes && (
        <EventInfo event={event} gallery={gallery} ticketTypes={ticketTypes} />
      )}
    </Layout>
  );
};

export default EventPage;
