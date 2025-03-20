export interface IEvent {
  id: number,
  title: string,
  cover_image_url: string,
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
  address: string,
}

export interface ICategory {
  name: string;
  slug: string;
}


