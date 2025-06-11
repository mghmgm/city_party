import Layout from './layout/Layout';
import {
  useFetchModerationReviewsQuery,
  useAcceptOrRejectReviewMutation,
} from '../store/ReviewAPI';
import Comment from '../components/UI/Comment/Comment';

const ModerationPanel = () => {
  const { data: reviews, refetch } = useFetchModerationReviewsQuery();

  const [acceptOrRejectReview] = useAcceptOrRejectReviewMutation();

  const handleReviewAction = async (reviewId, status) => {
    await acceptOrRejectReview({ reviewId, status }).unwrap();
    refetch();
    const updatedReview = await acceptOrRejectReview({ 
      reviewId, 
      status 
    }).unwrap();
    
    console.log('Updated review:', updatedReview);
  };

  return (
    <div>
      <Layout navIsVisible={false}>
        <div className="moderation__reviews">
          <h2>Отзывы на модерации</h2>
          <div className="moderation__reviews-content">
            {reviews &&
              reviews.reviews.map((review) => (
                <Comment
                  review={review}
                  section="moderation"
                  onAccept={() => handleReviewAction(review.id, 'accepted')}
                  onReject={() => handleReviewAction(review.id, 'rejected')}
                />
              ))}
          </div>
        </div>
        <div></div>
      </Layout>
    </div>
  );
};

export default ModerationPanel;
