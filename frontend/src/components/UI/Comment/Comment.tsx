import { FC } from 'react';
import classes from './Comment.module.scss';
import { IReview } from '../../../types/types';

interface ReviewProps {
  review: IReview;
}

const Review: FC<ReviewProps> = ({ review }) => {
  return (
    <div className={classes.comment}>
      <div>
        <img alt="" />
      </div>
      <div>
        <p className={classes.author}>{review.author_username}</p>

        <div className={classes.rating}>
          {Array.from({ length: 5 }, (_, index) => (
            <svg
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill={index < review.rating ? '#2929C8' : 'rgba(41, 41, 200, 0.5)'}
              className="bi bi-star-fill"
              viewBox="0 0 16 16"
            >
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
            </svg>
          ))}
        </div>

        <p className={classes.desc}>{review.description}</p>
      </div>
    </div>
  );
};

export default Review;
