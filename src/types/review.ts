export interface IReview {
  brand: string;
  model: string;
  picture?: string;
  review: string;
  owner: string;
  likes?: string[];
  comments?: string[];
  backupImage?: string;
}
