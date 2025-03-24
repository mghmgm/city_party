import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from './layout/Layout';
import { useFetch } from '../hooks/useFetch';
import EventService from '../API/EventService';
import EventInfo from '../components/EventInfo';
import CommentSection from '../components/CommentSection';

const EventPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState(null);
  const [gallery, setGallery] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [selectedRating, setSelectedRating] = useState('5');

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

  const [commentFetch] = useFetch(async () => {
    const response = await EventService.getComments(id);
    setComments(response.data);
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

    await EventService.postComment(id, {
      description: commentInput,
      rating: selectedRating,
    });

    setCommentInput('');
    setSelectedRating('');

    const response = await EventService.getComments(id);
    setComments(response.data);
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
