import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from './layout/Layout';
import { useFetch } from '../hooks/useFetch';
import EventService from '../API/EventService';
import EventInfo from '../components/EventInfo';
import CommentSection from '../components/CommentSection';
import { IPhoto } from '../types/types';

const EventPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const [event, setEvent] = useState({ id: 1, title: '', description: '', cover_image_url: '' });
  const [gallery, setGallery] = useState({ title: '', photos: [] as IPhoto[] });

  const [ticketTypes, setTicketTypes] = useState([
    { description: '', price: 0, event_date: new Date() },
  ]);

  const [comments, setComments] = useState({
    count: 0,
    reviews: [{ id: 1, description: '', rating: 0, author_username: '', pub_date: new Date() }],
  });

  const [commentInput, setCommentInput] = useState('');
  const [selectedRating, setSelectedRating] = useState('5');

  const [eventFetch] = useFetch(async () => {
    if (!id) return;
    const response = await EventService.getById(eventId);
    setEvent(response);
  });

  const [galleryFetch] = useFetch(async () => {
    const response = await EventService.getGallery(eventId, 3);
    setGallery(response);
  });

  const [ticketTypesFetch] = useFetch(async () => {
    const response = await EventService.getTicketTypes(eventId);
    setTicketTypes(response);
  });

  const [commentFetch] = useFetch(async () => {
    const response = await EventService.getComments(eventId);
    setComments(response);
  });

  useEffect(() => {
    eventFetch();
    galleryFetch();
    ticketTypesFetch();
    commentFetch();
  }, [id]);

  const saveComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!commentInput || !selectedRating) return;

    const newComment = {
      description: commentInput,
      rating: selectedRating,
    };

    console.log(newComment);

    await EventService.postComment(eventId, {
      description: commentInput,
      rating: selectedRating,
    });

    setCommentInput('');
    setSelectedRating('');

    const response = await EventService.getComments(eventId);
    setComments(response);
  };

  return (
    <Layout navIsVisible={true}>
      {event && gallery && ticketTypes && (
        <EventInfo event={event} gallery={gallery} ticketTypes={ticketTypes} />
      )}
      {comments && (
        <CommentSection
          comments={comments}
          onSubmit={saveComment}
          commentInput={commentInput}
          setCommentInput={setCommentInput}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
        />
      )}
    </Layout>
  );
};

export default EventPage;
