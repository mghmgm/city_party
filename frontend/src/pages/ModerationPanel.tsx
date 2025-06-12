import Layout from './layout/Layout';
import {
  useFetchModerationReviewsQuery,
  useAcceptOrRejectReviewMutation,
} from '../store/ReviewAPI';
import Comment from '../components/UI/Comment/Comment';
import Ticket from '../components/UI/Ticket/Ticket';
import {
  useGetCanceledTicketsQuery,
  useUpdatePaymentStatusMutation,
} from '../store/TicketAPI';
import Button from '../components/UI/Button/Button';
import { Link } from 'react-router';

const ModerationPanel = () => {
  const { data: reviews, refetch: refetchReviews } = useFetchModerationReviewsQuery();
  const [acceptOrRejectReview] = useAcceptOrRejectReviewMutation();
  const { data: canceledTickets, isLoading, error, refetch: refetchTickets } = useGetCanceledTicketsQuery();
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();

  const handleReviewAction = async (reviewId: number, status: string) => {
    try {
      await acceptOrRejectReview({ reviewId, status }).unwrap();
      refetchReviews();
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleTicketAction = async (ticketId: number, newStatus: string) => {
    try {
      await updatePaymentStatus({ ticketId, payment_status: newStatus }).unwrap();
      refetchTickets();
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  return (
    <Layout navIsVisible={false}>
      <section className="moderation content">
        <div className="moderation__reviews">
          <h2>Отзывы на модерации</h2>
          <div className="moderation__reviews-content">
            {reviews?.reviews?.map((review) => (
              <Comment
                key={review.id}
                review={review}
                section="moderation"
                onAccept={() => handleReviewAction(review.id, 'accepted')}
                onReject={() => handleReviewAction(review.id, 'rejected')}
              />
            ))}
          </div>
        </div>
        <div className="moderation__applications">
          <h2>Заявки на возврат</h2>
          <div className="moderation__tickets">
            {isLoading && <p>Загрузка заявок...</p>}
            {error && <p>Ошибка при загрузке заявок</p>}
            {canceledTickets?.length
              ? canceledTickets.map((ticket) => (
                  <Ticket key={ticket.id} ticket={ticket} type="ticket">
                    <Link to="" className="moderation__ticket-owner">{ticket.owner_username}</Link>
                    <div className="moderation__btns">
                      <Button onClick={() => handleTicketAction(ticket.id, 'canceled')}>
                        Одобрить
                      </Button>
                      <Button onClick={() => handleTicketAction(ticket.id, 'paid')}>
                        Отклонить
                      </Button>
                    </div>
                  </Ticket>
                ))
              : !isLoading && <p>Нет заявок на возврат</p>}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ModerationPanel;
