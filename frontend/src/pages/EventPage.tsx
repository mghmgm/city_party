import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from './layout/Layout';
import EventInfo from '../components/EventInfo';
import { IReview, ITicketType } from '../types/types';
import { EventAPI } from '../store/EventAPI';
import ReviewSection from '../components/ReviewSection';
import Modal from '../components/UI/Modal/Modal';
import Form from '../components/UI/Form/Form';
import Select from '../components/UI/Select/Select';
import Input from '../components/UI/Input/Input';
import Button from '../components/UI/Button/Button';
import star from '../assets/star.svg';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { TicketTypeAPI } from '../store/TicketTypeApi';
import { TicketAPI } from '../store/TicketAPI';

const EventPage: FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openedModal, setOpenedModal] = useState<string | null>(null);
  const [editReview, setEditReview] = useState<IReview | null>(null);
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [selectedTicket, setSelectedTicket] = useState<ITicketType | null>(null);
  const [ticketAmount, setTicketAmount] = useState(1);

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
  const [updateTicketQuantity] = TicketTypeAPI.useUpdateTicketQuantityMutation();
  const [createTicket] = TicketAPI.useCreateTicketMutation();

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
    setOpenedModal('comment_edit');
    setIsEditModalOpen(true);
  };

  const handleTicketClick = (e: React.MouseEvent, ticket: ITicketType) => {
    e.preventDefault();
    setSelectedTicket(ticket);
    setOpenedModal('ticket_order');
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

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !event) return;

    if (selectedTicket.available_quantity - ticketAmount < 0) {
      alert(`Недостаточно доступных билетов. Осталось: ${selectedTicket.available_quantity}`);
      return;
    }

    // Создаем билеты в цикле
    for (let i = 0; i < ticketAmount; i++) {
      await createTicket({
        ticket_type_id: selectedTicket.id,
      }).unwrap();
    }

    // Обновляем количество доступных билетов
    await updateTicketQuantity({
      ticketTypeId: selectedTicket.id,
      available_quantity: ticketAmount,
    }).unwrap();

    alert('Билеты успешно куплены!');
    setIsEditModalOpen(false);
    setSelectedTicket(null);
    setTicketAmount(1);
  };

  return (
    <Layout navIsVisible={true}>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        {openedModal === 'comment_edit' ? (
          <Form onSubmit={handleUpdateSubmit}>
            <div className="comments__rating">
              <img src={star} alt="" />
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
        ) : (
          <Form onSubmit={handleTicketSubmit}>
            {selectedTicket && (
              <div>
                <h2>{event?.title}</h2>
                <h3>{format(new Date(selectedTicket.start_date), 'd MMMM', { locale: ru })}</h3>
                <h3>
                  {format(new Date(selectedTicket.start_date), 'HH:mm', { locale: ru })} -{' '}
                  {format(new Date(selectedTicket.end_date), 'HH:mm', { locale: ru })}
                </h3>
                <h3>{selectedTicket.price} руб.</h3>
              </div>
            )}
            <input
              type="number"
              value={ticketAmount}
              onChange={(e) => setTicketAmount(parseInt(e.target.value) || 1)}
              className="ticket__amount"
              min="1"
            />
            <Button type="submit">Купить</Button>
          </Form>
        )}
      </Modal>

      {event && gallery && ticketTypes && (
        <EventInfo
          event={event}
          gallery={gallery}
          ticketTypes={ticketTypes}
          onClick={handleTicketClick}
        />
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
