import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from './layout/Layout';
import EventInfo from '../components/EventInfo';
import { IReview } from '../types/types';
import { EventAPI } from '../store/EventAPI';
import ReviewSection from '../components/ReviewSection';

const EventPage: FC = () => {
  const { id } = useParams();
  const eventId = Number(id);
  const [commentInput, setCommentInput] = useState('');
  const [selectedRating, setSelectedRating] = useState('5');

  const defaultReview: IReview = {id:1, description:'', rating: 5, author_username: 'user', pub_date: new Date('01-01-2025')}

  const {data: event } = EventAPI.useFetchEventByIdQuery(eventId)
  const {data: gallery } = EventAPI.useFetchGalleryQuery(eventId)
  const {data: ticketTypes } = EventAPI.useFetchTicketTypesQuery(eventId)
  const {data: reviews, isLoading: isReviewsLoading, refetch: refetchReviews } = EventAPI.useFetchReviewsQuery(eventId)

  const [createReview] = EventAPI.useCreateReviewMutation();

  const shownReviews = isReviewsLoading ? defaultReview : reviews

  const saveComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!commentInput || !selectedRating) return;

    const newReview: Omit<IReview, 'id' | 'author_username' | 'pub_date'> = {
      description: commentInput,
      rating: Number(selectedRating),
    };


    try {
      await createReview({
        eventId: eventId,
        data: newReview,
      }).unwrap();
  
      setCommentInput('');
      setSelectedRating('5');
  
      refetchReviews()
    } catch (err: any) {
      if (err.status === 401) {
        alert('Отзывы могут оставлять только авторизированные пользователи.')
      }
    };
  }

  return (
    <Layout navIsVisible={true}>
        {event && gallery && ticketTypes && (
          <EventInfo event={event} gallery={gallery} ticketTypes={ticketTypes} />
        )}
        {reviews && (
          <ReviewSection
          reviews={shownReviews}
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
