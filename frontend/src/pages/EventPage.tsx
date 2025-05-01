import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from './layout/Layout';
import { useFetch } from '../hooks/useFetch';
import EventService from '../API/EventService';
import EventInfo from '../components/EventInfo';
import CommentSection from '../components/ReviewSection';
import { IPhoto, IReview } from '../types/types';
import { EventAPI } from '../store/EventAPI';

const EventPage: FC = () => {
  const { id } = useParams();
  const eventId = Number(id);

  const defaultReview: IReview = {id:1, description:'', rating: 5, author_username: 'user', pub_date: new Date('01-01-2025')}

  const {data: event } = EventAPI.useFetchEventByIdQuery(eventId)
  const {data: reviews, isLoading: isReviewsLoading } = EventAPI.useFetchReviewsQuery(eventId)

  const shownReviews =isReviewsLoading ? defaultReview : reviews

  return (
    <Layout navIsVisible={true}>
        <ReviewSection
          comments={shownReviews}
          // onSubmit={saveComment}
          // commentInput={commentInput}
          // setCommentInput={setCommentInput}
          // selectedRating={selectedRating}
          // setSelectedRating={setSelectedRating}
        />
    </Layout>
  );
};

export default EventPage;
