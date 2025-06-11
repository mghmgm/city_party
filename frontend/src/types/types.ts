export interface IEvent {
  id: number;
  title: string;
  description: string;
  cover_image_url: string;
  reviews_count: number;
  rating_avg: number;
}

export interface IBanner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  event_id: number;
}

export interface IPlace {
  id: number;
  name: string;
  description: string;
  photo_url: string;
  address: string;
}

export interface ICategory {
  id: number,
  name: string;
  slug: string;
}

export interface IPhoto {
  image: string;
  title: string;
  caption: string;
}

export interface IGallery {
  title: string;
  photos: IPhoto[];
}

export interface ITicketType {
  start_date: Date;
  end_date: Date;
  price: number;
}

export interface IReview {
  id: number;
  event_id: number;
  description: string;
  rating: number;
  author_username: string;
  pub_date: Date;
}

export interface IReviews {
  count: number;
  reviews: IReview[];
}

export interface IUserProfile {
  first_name: string;
  last_name: string;
  username: string;
  vk_profile: string;
  avatar: string;
  description: string;
  active_tickets: ITicket[];
  used_tickets: ITicket[];
  is_superuser: boolean;
}

export interface ITicket {
  event_title: string;
  event_id: number;
  ticket_type: ITicketType;
  owner: IUserProfile;
  payment_status: string;
  cover_img_url: string;
}
