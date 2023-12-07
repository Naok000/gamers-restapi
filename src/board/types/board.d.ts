export type commentUser = {
  id: string;
  user: { userName: string; avatar: { avatarImgURL: string } };
  comment: string;
  timestamp: Date;
};

export type postedAll = {
  id: string;
  gameTitle: string;
  title: string;
  content: string;
  thumbnail: { imageURL: string };
};

export type postingById = {
  id: string;
  userId: string;
  gameTitle: string;
  title: string;
  content: string;
  createdAt: Date;
  user: { userName: string; avatar: { avatarImgURL: string } };
  thumbnail: { imageURL: string; thumbnailFileName: string };
};
