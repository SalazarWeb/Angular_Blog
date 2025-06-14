export interface Post {
  id: string;
  title: string;
  date: string;
  summary: string;
  fileName: string;
  content?: string;
  tags?: string[];
  author?: string;
}

export interface PostMetadata {
  title: string;
  date: string;
  summary: string;
  tags?: string[];
  author?: string;
}