export interface IEvent {
  id: number;
  title: string;
  description: string;
  cover_image_url: string;
}

export interface IBanner {
  id: number;
  title: string;
  description: string;
  image_url: string;
}

export interface IPlace {
  id: number;
  name: string;
  description: string;
  photo_url: string;
  address: string;
}

export interface ICategory {
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
  description: string;
  price: number;
  event_date: Date;
}

export interface IReview {
  id: number;
  description: string;
  rating: number;
  author_username: string;
  pub_date: Date;
}
