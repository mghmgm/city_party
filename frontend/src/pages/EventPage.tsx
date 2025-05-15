import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from './layout/Layout';
import EventInfo from '../components/EventInfo';
import { IReview } from '../types/types';
import { EventAPI } from '../store/EventAPI';
import ReviewSection from '../components/ReviewSection';
import Modal from '../components/UI/Modal/Modal';
import Form from '../components/UI/Form/Form';
import Select from '../components/UI/Select/Select';
import Input from '../components/UI/Input/Input';
import Button from '../components/UI/Button/Button';

const EventPage: FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editReview, setEditReview] = useState<IReview | null>(null);
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState(5);

  const { id } = useParams();
  const eventId = Number(id);
  const [commentInput, setCommentInput] = useState('');
  const [selectedRating, setSelectedRating] = useState('5');

  const defaultReview: IReview = {
    id: 1,
    event_id: eventId,
    description: '',
    rating: 5,
    author_username: 'user',
    pub_date: new Date('01-01-2025'),
  };

  const { data: event } = EventAPI.useFetchEventByIdQuery(eventId);
  const { data: gallery } = EventAPI.useFetchGalleryQuery(eventId);
  const { data: ticketTypes } = EventAPI.useFetchTicketTypesQuery(eventId);
  const {
    data: reviews,
    isLoading: isReviewsLoading,
    refetch: refetchReviews,
  } = EventAPI.useFetchReviewsQuery(eventId);

  const [createReview] = EventAPI.useCreateReviewMutation();
  const [deleteReview] = EventAPI.useDeleteReviewMutation();
  const [updateReview] = EventAPI.useUpdateReviewMutation();

  const shownReviews = isReviewsLoading ? [defaultReview] : reviews;

  const saveComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!commentInput || !selectedRating) return;

    const newReview: Omit<IReview, 'id' | 'author_username' | 'pub_date' | 'event_id'> = {
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

      refetchReviews();
    } catch (err: any) {
      if (err.status === 401) {
        alert('Отзывы могут оставлять только авторизированные пользователи.');
      }
    }
  };

  const deleteComment = async (e: React.MouseEvent, review: IReview) => {
    e.preventDefault();
    try {
      await deleteReview({ eventId: review.event_id, reviewId: review.id }).unwrap();
      refetchReviews();
    } catch (error) {
      console.error('Ошибка при удалении отзыва', error);
    }
  };

  const handleEditClick = (e: React.MouseEvent, review: IReview) => {
    e.preventDefault();
    setEditReview(review);
    setEditText(review.description);
    setEditRating(review.rating);
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editReview) return;

    try {
      await updateReview({
        eventId: editReview.event_id,
        reviewId: editReview.id,
        data: {
          description: editText,
          rating: editRating,
        },
      }).unwrap();

      setIsEditModalOpen(false);
      setEditReview(null);
      refetchReviews();
    } catch (error) {
      console.error('Ошибка при обновлении отзыва', error);
    }
  };

  return (
    <Layout navIsVisible={true}>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Form onSubmit={handleUpdateSubmit}>
          <div className="comments__rating">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="#2929C8"
            className="bi bi-star-fill"
            viewBox="0 0 16 16"
          >
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
          </svg>
          <Select
            options={['1', '2', '3', '4', '5']}
            onChange={(e) => setSelectedRating(e.target.value ?? '')}
            value={selectedRating}
          />
        </div>
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Отзыв"
          />
          <Button type="submit">Изменить</Button>
        </Form>
      </Modal>

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
          onDelete={deleteComment}
          onEdit={handleEditClick}
        />
      )}
    </Layout>
  );
};

export default EventPage;
