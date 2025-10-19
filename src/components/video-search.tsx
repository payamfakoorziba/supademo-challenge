"use client";

import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { Video, VideosResponse } from "@/lib/types";
import { Pagination } from "./ui/pagination";
import Link from "next/link";
import { cn } from "@/lib/utils";

const VideoSearch = ({
  onVideoClick,
}: {
  onVideoClick?: (video: Video) => void;
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [query, setQuery] = useState<string>(searchParams.get("query") || "");
  const debouncedQuery = useDebounce(query, 500, true);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.get("page") || "1")
  );
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalVideos: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
  });

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Update URL with new page number
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // Sync query and page with search params
  useEffect(() => {
    setQuery(searchParams.get("query") || "");
    setCurrentPage(parseInt(searchParams.get("page") || "1"));
  }, [searchParams]);

  // Update URL with debounced query when debouncedQuery changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedQuery) {
      params.set("query", debouncedQuery);
    } else {
      params.delete("query");
    }
    params.delete("page");
    setCurrentPage(1);
    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedQuery]);

  // Fetch videos when query or page changes
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const url = `/api/videos?query=${debouncedQuery}&page=${currentPage}&limit=10`;
        const response = await fetch(url);
        const data: VideosResponse = await response.json();
        setVideos(data.videos);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [debouncedQuery, currentPage]);

  const handleClearQuery = () => {
    setQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col flex-1 gap-4 min-h-0 h-full">
      <Input
        type="text"
        placeholder="Search"
        value={query}
        onChange={handleQueryChange}
      />

      {/* Results */}
      {videos.length > 0 && (
        <div className="flex flex-col flex-1 gap-4 min-h-0">
          {/* Results info */}
          <div className="text-sm text-neutral-600">
            Showing {videos.length} of {pagination.totalVideos} videos
            {pagination.totalPages > 1 && (
              <span>
                {" "}
                (Page {pagination.currentPage} of {pagination.totalPages})
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-4 min-h-0 p-1 -m-1">
            {videos.map((video) => (
              <VideoCard
                key={video.snippet.title + video.id.videoId}
                video={video}
                loading={loading}
                onVideoClick={onVideoClick}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
            onPageChange={handlePageChange}
            className="mx-auto"
          />
        </div>
      )}

      {/* No results found */}
      {debouncedQuery && !loading && videos.length === 0 && (
        <div className="text-neutral-500 text-center flex flex-col items-center justify-center flex-1">
          No results found
          <button
            className="text-sm text-neutral-900 hover:underline"
            onClick={handleClearQuery}
          >
            Clear search
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && videos.length === 0 && (
        <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-y-hidden">
          <div className="w-3/4 h-5 shrink-0 bg-neutral-200/70 rounded-lg" />
          <div className="flex flex-col flex-1 gap-4 min-h-0">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="bg-neutral-200/70 rounded-lg h-[106px] shrink-0"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const VideoCard = ({
  video,
  loading,
  onVideoClick,
}: {
  video: Video;
  loading: boolean;
  onVideoClick?: (video: Video) => void;
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  return (
    <Link
      key={video.snippet.title + video.id.videoId}
      href={`/${video.id.videoId}?${searchParams.toString()}`}
      className={cn(
        "bg-white p-4 rounded-lg cursor-pointer border border-transparent hover:border-neutral-400",
        loading && "opacity-60",
        pathname.includes(video.id.videoId) && "bg-neutral-900 text-white"
      )}
      onClick={() => onVideoClick?.(video)}
    >
      <h3 className="font-semibold line-clamp-1">{video.snippet.title}</h3>
      <p className="text-sm text-neutral-500 line-clamp-2 mt-2">
        {video.snippet.description}
      </p>
    </Link>
  );
};

export default VideoSearch;
