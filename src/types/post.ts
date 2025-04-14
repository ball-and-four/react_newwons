export interface Post {
  postTitle: string;
  postContent: string;
  postFile: Blob | File | null;
  author: string;
  category: string;
  timestamp: string;
}

export interface PostCardProps {
  thumbnail?: string;
  postTitle: string;
  postContent?: string;
  author: string;
  category: string;
  timestamp: string;
  param: string;
}

export interface PostInfoProps {
  title: string;
  content?: string;
  author: string;
  category: string;
  timestamp: string;
  href: string;
  profile?: string;
}
