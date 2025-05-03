import { FC } from 'react';
import { IReviews } from '../types/types';
import Comment from './UI/Comment/Comment';
import Input from './UI/Input/Input';
import Select from './UI/Select/Select';
import Button from './UI/Button/Button';

interface ReviewSectionProps {
  reviews: IReviews;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  commentInput: string;
  setCommentInput: (value: string) => void;
  selectedRating: string;
  setSelectedRating: (value: string) => void;
}

const ReviewSection: FC<ReviewSectionProps> = ({
  reviews,
  onSubmit,
  commentInput,
  setCommentInput,
  selectedRating,
  setSelectedRating,
}) => {
  return (
    <div className="comments content">
      <h2>Отзывы ({reviews.count})</h2>

      <form className="comments__form" onSubmit={onSubmit}>
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
        <div className="comments__input">
          <Input
            type="text"
            id="comment"
            onChange={(e) => setCommentInput(e.target.value)}
            value={commentInput}
          />
          <Button type="submit">Отправить</Button>
        </div>
      </form>

      <div className="comments__containter">
        {reviews.reviews.map((review) => (
          <Comment review={review} />
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
