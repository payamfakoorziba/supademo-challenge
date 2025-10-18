export type Video = {
  id: string;
  title: string;
  description: string;
};

export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalVideos: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
};

export type VideosResponse = {
  videos: Video[];
  pagination: PaginationInfo;
};
